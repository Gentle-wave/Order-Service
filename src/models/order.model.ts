import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  itemId: Types.ObjectId; // Reference to Inventory item
  quantity: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    itemId: { type: Schema.Types.ObjectId, required: true, ref: 'Item' },
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], required: true },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
