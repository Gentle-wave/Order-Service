import supertest from 'supertest';
import app from '../../index';
import mongoose from 'mongoose';
import Order from '../../models/order.model';

const request = supertest(app);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/order-service-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await Order.deleteMany({});
});

describe('Order Routes', () => {
  it('should create an order', async () => {
    const res = await request.post('/api/orders').send({ itemId: '67501f294adcdc92109aa436', quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.order.itemId).toBe('67501f294adcdc92109aa436');
  });

  it('should fetch order details', async () => {
    const order = await Order.create({ itemId: '67501f294adcdc92109aa436', quantity: 2 });

    const res = await request.get(`/api/orders/${order._id}`);

    expect(res.status).toBe(200);
    expect(res.body.order.itemId).toBe('67501f294adcdc92109aa436');
  });
});
