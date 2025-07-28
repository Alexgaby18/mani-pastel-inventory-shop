export interface Product {
    _id: string;
    code: string;
    name: string;
    price: number;
    brand?: string;
    stock?: number;
    dateAdded?: Date;
    flete?: number;
    cost?: number;
    unit_measure?: string;
}

export type CreateProduct = Omit<Product, 'dateAdded' | '_id'>;
export type UpdateProduct = Partial<Product>;

