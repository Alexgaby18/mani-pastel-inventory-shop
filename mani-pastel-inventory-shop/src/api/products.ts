import { CreateProduct
, UpdateProduct
 } from "@/interfaces/product.interface";

 const API = "http://localhost:3000/product";

 export const createProduct = async (product: CreateProduct): Promise<any> => {
   const response = await fetch(API, {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(product),
   });
   return response.json();
 };

    export const updateProduct = async (id: string, product: UpdateProduct): Promise<any> => {
    const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
    });
    return response.json();
    };