import { createOrder, getOrderDetails } from '../../controllers/order.controller';
import Order from '../../models/order.model';
import * as inventoryService from '../../services/inventory.service';
import * as kafkaProducer from '../../utils/kafka.producer';
import { Request, Response } from 'express';
import { AppError } from '../../middlewares/error.middleware';

jest.mock('../../services/inventory.service');
jest.mock('../../utils/kafka.producer');
jest.mock('../../models/order.model');

describe('Order Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const next = jest.fn();

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should create an order successfully', async () => {
    req.body = { itemId: '67501f294adcdc92109aa436', quantity: 2 };

    jest.spyOn(inventoryService, 'getStock').mockResolvedValue(10);
    jest.spyOn(inventoryService, 'updateStock').mockResolvedValue(undefined);
    jest.spyOn(Order, 'create').mockResolvedValue({ _id: 'order123', ...req.body });
    jest.spyOn(kafkaProducer, 'publishEvent').mockResolvedValue(undefined);

    await createOrder(req as Request, res as Response, next);

    expect(inventoryService.getStock).toHaveBeenCalledWith('67501f294adcdc92109aa436');
    expect(inventoryService.updateStock).toHaveBeenCalledWith('67501f294adcdc92109aa436', 8);
    expect(Order.create).toHaveBeenCalledWith({ itemId: '67501f294adcdc92109aa436', quantity: 2 });
    expect(kafkaProducer.publishEvent).toHaveBeenCalledWith('order-events', {
      event: 'ORDER_CREATED',
      orderId: 'order123',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ order: { _id: 'order123', ...req.body } });
  });

  it('should return 400 error for insufficient stock', async () => {
    req.body = { itemId: 'item123', quantity: 5 };

    jest.spyOn(inventoryService, 'getStock').mockResolvedValue(3);

    await createOrder(req as Request, res as Response, next);

    expect(inventoryService.getStock).toHaveBeenCalledWith('item123');
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(400);
    expect(next.mock.calls[0][0].message).toBe('Insufficient stock for the item');
  });

  it('should fetch order details successfully', async () => {
    req.params = { id: 'order123' };

    jest.spyOn(Order, 'findById').mockResolvedValue({
      _id: 'order123',
      itemId: 'item123',
      quantity: 2,
    });

    await getOrderDetails(req as Request, res as Response, next);

    expect(Order.findById).toHaveBeenCalledWith('order123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      order: { _id: 'order123', itemId: 'item123', quantity: 2 },
    });
  });

  it('should return 404 error if order not found', async () => {
    req.params = { id: 'order123' };

    jest.spyOn(Order, 'findById').mockResolvedValue(null);

    await getOrderDetails(req as Request, res as Response, next);

    expect(Order.findById).toHaveBeenCalledWith('order123');
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(404);
    expect(next.mock.calls[0][0].message).toBe('Order not found');
  });
});
