import { CreateInvoice, UpdateInvoice, Invoice } from "@/interfaces/invoice.interface";
import { createContext, useState, useEffect } from "react";
import { createInvoice, updateInvoice, getInvoices, deleteInvoice } from "@/api/invoice";

interface InvoiceContextType {
  invoices: Invoice[];
  createInvoice: (invoice: CreateInvoice) => Promise<void>;
  updateInvoice: (id: string, invoice: UpdateInvoice) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
}

export const InvoiceContext = createContext<InvoiceContextType>({
    invoices: [],
    createInvoice: async () => {
         throw new Error("createInvoice()  not implemented.");
    },
    updateInvoice: async () => {
        throw new Error("updateInvoice() not implemented.");
    },
    deleteInvoice: async () => {
        throw new Error("deleteInvoice() not implemented.");
    },
});

interface Props {
  children: React.ReactNode;
}

export const InvoiceProvider: React.FC<Props> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    getInvoices().then(setInvoices);
  }, []);

  const handleCreateInvoice = async (invoice: CreateInvoice) => {
    const newInvoice = await createInvoice(invoice);
    setInvoices((prev) => [...prev, newInvoice]);
  };

  const handleUpdateInvoice = async (id: string, invoice: UpdateInvoice) => {
    const updatedInvoice = await updateInvoice(id, invoice);
    setInvoices((prev) =>
      [...prev.map((p) => (p._id === id ? updatedInvoice : p))]
    );
    const refreshedInvoices = await getInvoices();
    setInvoices(refreshedInvoices);
  };

  const handleDeleteInvoice = async (id: string) => {
    await deleteInvoice(id);
    setInvoices((prev) => prev.filter((p) => p._id !== id));
  };

  const handleGetInvoices = async () => {
    const fetchedProducts = await getInvoices();
    setInvoices(fetchedProducts);
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        createInvoice: handleCreateInvoice,
        updateInvoice: handleUpdateInvoice,
        deleteInvoice: handleDeleteInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};