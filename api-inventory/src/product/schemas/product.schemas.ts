import { Schema } from 'mongoose';

export const productSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  dateAdded: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  flete: { type: Number, required: true },
  cost: { type: Number, required: true },
  unit_measure: { type: String, required: true },
  branch: { type: String, required: false },
});
