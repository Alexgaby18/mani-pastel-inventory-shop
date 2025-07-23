import { createContext, useEffect, useState } from "react";
import {
  CreateProduct,
  UpdateProduct,
  Product,
} from "@/interfaces/product.interface";
import { createProduct, updateProduct } from "../api/products";

interface ProductContextType {
  products: Product[];
  createProduct: (product: CreateProduct) => Promise<void>;
  updateProduct: (id: string, product: UpdateProduct) => Promise<void>;
}

export const ProductContext = createContext<ProductContextType>({
    products: [],
    createProduct: async () => {
         throw new Error("createProduct()  not implemented.");
    },
    updateProduct: async () => {
        throw new Error("updateProduct() not implemented.");
    }
});

interface Props {
  children: React.ReactNode;
}

export const ProductProvider: React.FC<Props> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products from API or initialize state
    // This is just a placeholder; you can implement actual fetching logic here
    setProducts([]);
  }, []);

  const handleCreateProduct = async (product: CreateProduct) => {
    const newProduct = await createProduct(product);
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleUpdateProduct = async (id: string, product: UpdateProduct) => {
    const updatedProduct = await updateProduct(id, product);
    setProducts((prev) =>
      prev.map((p) => (p.code === id ? updatedProduct : p))
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        createProduct: handleCreateProduct,
        updateProduct: handleUpdateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};