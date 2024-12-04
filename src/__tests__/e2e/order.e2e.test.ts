import supertest from 'supertest';
import app from '../../index';
import mongoose from 'mongoose';

const request = supertest(app);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/order-service-test');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Order Service End-to-End', () => {
  it('should handle the complete order lifecycle', async () => {
    // Mock Inventory Service (in a real test, use a test Inventory instance)
    const inventoryStockResponse = { stock: 10 };
    jest.spyOn(require('axios'), 'get').mockResolvedValueOnce({ data: inventoryStockResponse });
    jest.spyOn(require('axios'), 'patch').mockResolvedValueOnce({});

    // Create Order
    const res = await request.post('/api/orders').send({ itemId: '67501f294adcdc92109aa436', quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.order.itemId).toBe('67501f294adcdc92109aa436');
  });
});
