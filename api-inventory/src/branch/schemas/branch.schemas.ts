import { Schema } from 'mongoose';

export const branchSchema = new Schema({
  name: { type: String, required: true, unique: true },
  dateAdded: { type: Date, default: Date.now },
});
