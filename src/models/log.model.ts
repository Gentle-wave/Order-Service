import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  event: string;
  payload: object; 
  createdAt: Date;
}

const LogSchema: Schema<ILog> = new Schema(
  {
    event: { type: String, required: true },
    payload: { type: Object, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Only track `createdAt`
);

export default mongoose.model<ILog>('Log', LogSchema);
