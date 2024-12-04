import { Request, Response, NextFunction } from 'express';
import { getStock, updateStock,getPrice } from '../services/inventory.service';
import Order from '../models/order.model';
import { publishEvent } from '../utils/kafka.producer';
import { AppError } from '../middlewares/error.middleware';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { itemId, quantity } = req.body;

    // Check stock availability via Inventory Service
    const availableStock = await getStock(itemId);

    if (availableStock < quantity) {
      throw new AppError('Insufficient stock for the item', 400);
    }

    // Fetch item price via Inventory Service
    const item = await getPrice(itemId);
    if (!item) {
      throw new AppError('Item not found', 404);
    }

    const totalPrice = item * quantity;

    // // Deduct stock via Inventory Service
    await updateStock(itemId, availableStock - quantity);

    // Create order with calculated fields
    const newOrder = await Order.create({
      itemId,
      quantity,
      totalPrice,
      status: 'PENDING', 
    });

    res.status(201).json({
      // status: 'success',
      order: newOrder,
    });

    // Publish order-created event
    const eventMessage = { event: 'ORDER_CREATED', orderId: newOrder._id };
    await publishEvent('order-events', eventMessage);

    console.log('📤 Order-created event published.');
  } catch (error) {
    next(error);
  }
};


export const getOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    res.status(200).json({
      // status: `success`,
      order
    });
  } catch (error) {
    next(error);
  }
};
