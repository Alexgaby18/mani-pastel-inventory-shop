import { Document } from 'mongoose';

export interface Product extends Document {
  readonly code: string;
  readonly name: string;
  readonly price: number;
  readonly brand?: string;
  readonly stock?: number;
  readonly dateAdded?: Date;
  readonly flete?: number;
  readonly cost?: number;
  readonly unit_measure?: string;
}
