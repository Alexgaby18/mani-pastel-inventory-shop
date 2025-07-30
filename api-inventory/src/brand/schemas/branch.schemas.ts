import { Schema } from 'mongoose';

export const brandSchema = new Schema({
  name: { type: String, required: true, unique: true },
  dateAdded: { type: Date, default: Date.now },
});
