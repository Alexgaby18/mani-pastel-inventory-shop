export interface Product {
    code: string;
    name: string;
    price: number;
    branch?: string;
    stock?: number;
    dateAdded?: Date;
    flete?: number;
    cost?: number;
    unit_measure?: string;
}

export type CreateProduct = Omit<Product, 'dateAdded'>;
export type UpdateProduct = Partial<Product>;

