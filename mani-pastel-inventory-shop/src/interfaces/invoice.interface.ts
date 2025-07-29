export interface Invoice {
    _id: string;
    invoiceNumber: string;
    dateIssued: Date;
    customerName: string;
    idCard: string;
    customerPhone: string;
    totalAmount: number;
    items: Array<{
        itemName: string;
        quantity: number;
        pricePerItem: number;
    }>;
}
export type CreateInvoice = Omit<Invoice, '_id' | 'dateIssued'>;
export type UpdateInvoice = Partial<Invoice>;
    