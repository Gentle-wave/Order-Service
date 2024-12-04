import axios from 'axios';
import { AppError } from '../middlewares/error.middleware';

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:4000';

export const getStock = async (itemId: string): Promise<number> => {
  const response = await axios.get(`${INVENTORY_SERVICE_URL}/api/items/stock/${itemId}`);
  return response.data.stock;
};

export const updateStock = async (itemId: string, newStock: number): Promise<void> => {
  await axios.patch(`${INVENTORY_SERVICE_URL}/api/items/update-stock/${itemId}`, {
    stock: newStock,
  });
};

export const getPrice = async (itemId: string): Promise<number> => {
  const response = await axios.get(`${INVENTORY_SERVICE_URL}/api/items/stock/${itemId}`);
  return response.data.price;
};
