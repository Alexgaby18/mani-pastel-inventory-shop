import { CreateInvoice, UpdateInvoice } from "@/interfaces/invoice.interface";

const API = "http://localhost:3000/invoice";

export const createInvoice = async (invoice: CreateInvoice) => {
  const response = await fetch(`${API}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoice),
  });
  return response.json();
};

export const updateInvoice = async (id: string, invoice: UpdateInvoice) => {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoice),
  });
  return response.json();
};

export const getInvoices = async () => {
  const response = await fetch(API);
  return response.json();
};

export const getInvoiceById = async (id: string) => {
  const response = await fetch(`${API}/${id}`);
  return response.json();
};

export const deleteInvoice = async (id: string) => {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

export const getInvoicesByClientId = async (clientId: string) => {
  const response = await fetch(`${API}/client/${clientId}`);
  return response.json();
};

export const getInvoicesByDateRange = async (startDate: string, endDate: string) => {
  const response = await fetch(`${API}/date-range?start=${startDate}&end=${endDate}`);
  return response.json();
};

