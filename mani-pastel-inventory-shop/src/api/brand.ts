import { Createbrand, Updatebrand } from '../interfaces/branch.interface';

const API = "http://localhost:3000/brand";

export const createbrand = async (brand: Createbrand) => {
  const response = await fetch(`${API}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(brand),
  });
  return response.json();
};

export const updatebrand = async (id: string, brand: Updatebrand) => {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(brand),
  });
  return response.json();
};

export const getbrandes = async () => {
  const response = await fetch(API);
  return response.json();
};

export const getbrandById = async (id: string) => {
  const response = await fetch(`${API}/${id}`);
  return response.json();
};

export const deletebrand = async (id: string) => {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  return response.json();
};