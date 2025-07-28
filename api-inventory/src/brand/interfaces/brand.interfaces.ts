import { Document } from 'mongoose';

export interface brand extends Document {
  readonly name: string;
}
