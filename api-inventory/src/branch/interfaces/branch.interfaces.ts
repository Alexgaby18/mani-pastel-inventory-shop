import { Document } from 'mongoose';

export interface Branch extends Document {
  readonly name: string;
}
