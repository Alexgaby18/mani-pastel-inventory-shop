export interface Brand {
    _id: string;
    name: string;
    dateAdded?: Date;
}

export type CreateBrand = Omit<Brand, '_id' | 'dateAdded'>;
export type UpdateBrand = Partial<Brand>;