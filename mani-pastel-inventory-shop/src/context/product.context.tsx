import { createContext, useEffect, useState } from "react";
import {
  CreateProduct,
  UpdateProduct,
  Product,
} from "@/interfaces/product.interface";
import { createProduct, updateProduct,  getProducts, getProductById, deleteProduct} from "../api/products";

interface ProductContextType {
  products: Product[];
  createProduct: (product: CreateProduct) => Promise<void>;
  updateProduct: (id: string, product: UpdateProduct) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const ProductContext = createContext<ProductContextType>({
    products: [],
    createProduct: async () => {
         throw new Error("createProduct()  not implemented.");
    },
    updateProduct: async () => {
        throw new Error("updateProduct() not implemented.");
    },
    deleteProduct: async () => {
        throw new Error("deleteProduct() not implemented.");
    },
});

interface Props {
  children: React.ReactNode;
}

export const ProductProvider: React.FC<Props> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleCreateProduct = async (product: CreateProduct) => {
    const newProduct = await createProduct(product);
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleUpdateProduct = async (id: string, product: UpdateProduct) => {
    const updatedProduct = await updateProduct(id, product);
    setProducts((prev) =>
      [...prev.map((p) => (p._id === id ? updatedProduct : p))]
    );
    const refreshedProducts = await getProducts();
    setProducts(refreshedProducts);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const handleGetProducts = async () => {
    const fetchedProducts = await getProducts();
    setProducts(fetchedProducts);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        createProduct: handleCreateProduct,
        updateProduct: handleUpdateProduct,
        deleteProduct: handleDeleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};