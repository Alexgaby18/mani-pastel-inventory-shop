import { CreateBrand, UpdateBrand } from '../interfaces/brand.interface';

const API = "https://mani-pastel-inventory-shop-backend.onrender.com/brand";

export const createBrand = async (brand: CreateBrand) => {
  const response = await fetch(`${API}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(brand),
  });
  return response.json();
};

export const updateBrand = async (id: string, brand: UpdateBrand) => {
  const response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(brand),
  });
  return response.json();
};

export const getBrandes = async () => {
  const response = await fetch(API);
  return response.json();
};

export const getBrandById = async (id: string) => {
  const response = await fetch(`${API}/${id}`);
  return response.json();
};

export const deleteBrand = async (id: string) => {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  return response.json();
};