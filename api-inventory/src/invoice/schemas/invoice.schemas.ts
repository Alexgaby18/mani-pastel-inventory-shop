import { Schema } from 'mongoose';

export const invoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  customerName: { type: String },
  dateIssued: { type: Date, default: Date.now },
  totalAmount: { type: Number },
  customerPhone: { type: String },
  idCard: { type: String },
  items: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
      pricePerItem: { type: Number, required: true },
    },
  ],
});
