export interface brand {
    _id: string;
    name: string;
    dateAdded?: Date;
}

export type Createbrand = Omit<brand, '_id' | 'dateAdded'>;
export type Updatebrand = Partial<brand>;