import express, { Express, Request, Response, NextFunction } from 'express';
import { connectDB } from './config/db';
import { connectKafka } from './config/kafka';
import dotenv from 'dotenv';
import router from './routes/order.routes';
import { errorMiddleware } from './middlewares/error.middleware';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/orders', router);

// Global Error Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.use(errorMiddleware);

// Start Server
const startServer = async () => {
  await connectDB();
//   await connectKafka();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();

export default app;
