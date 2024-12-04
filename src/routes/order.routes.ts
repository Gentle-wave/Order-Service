import { Router } from 'express';
import { createOrder, getOrderDetails } from '../controllers/order.controller';

const router = Router();

// Create a new order
router.post('/create', createOrder);

// Get order details
router.get('/:id', getOrderDetails);

export default router;
