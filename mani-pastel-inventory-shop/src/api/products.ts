import { CreateProduct
, UpdateProduct
 } from "@/interfaces/product.interface";

 const API = "http://localhost:3000/product";

 export const createProduct = async (product: CreateProduct) => {
   const response = await fetch(`${API}/create`, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(product),
   });
   return response.json();
 };

  export const updateProduct = async (id: string, product: UpdateProduct) => {
  const response = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
  });
  return response.json();
  };

  export const getProducts = async () => {  
    const response = await fetch(API);
    return response.json();
  }

  export const getProductById = async (id: string) => {
    const response = await fetch(`${API}/${id}`);
  }

  export const deleteProduct = async (id: string) => {
    const response = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }