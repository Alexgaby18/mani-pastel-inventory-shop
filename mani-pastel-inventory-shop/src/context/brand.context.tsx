import { createContext, useEffect, useState } from 'react';
import { CreateBrand, UpdateBrand, Brand } from '@/interfaces/brand.interface';
import { createBrand, updateBrand, getBrandes, deleteBrand } from '../api/brand';

interface BrandContextType {
  brands: Brand[];
    loading: boolean;
    createBrand: (brand: CreateBrand) => Promise<void>;
    updateBrand: (id: string, brand: UpdateBrand) => Promise<void>;
    deleteBrand: (id: string) => Promise<void>;
}   

export const BrandContext = createContext<BrandContextType>({
  brands: [],
    loading: true,
  createBrand: async () => {
    throw new Error('createBrand() not implemented.');
  },
    updateBrand: async () => {
        throw new Error('updateBrand() not implemented.');
    },
    deleteBrand: async () => {
        throw new Error('deleteBrand() not implemented.');
    },
});

interface Props {
  children: React.ReactNode;
}

export const BrandProvider: React.FC<Props> = ({ children }) => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await getBrandes();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
    }, []);
    
    const handleCreateBrand = async (brand: CreateBrand) => {
        const newBrand = await createBrand(brand);
        setBrands((prev) => [...prev, newBrand]);
    };
    
    const handleUpdateBrand = async (id: string, brand: UpdateBrand) => {
        const updatedBrand = await updateBrand(id, brand);
        setBrands((prev) =>
        prev.map((b) => (b._id === id ? updatedBrand : b))
        );
        const refreshedBrands = await getBrandes();
        setBrands(refreshedBrands);
    };
    
    const handleDeleteBrand = async (id: string) => {
        await deleteBrand(id);
        setBrands((prev) => prev.filter((b) => b._id !== id));
    };
    
    return (
        <BrandContext.Provider
        value={{
            brands,
            loading,
            createBrand: handleCreateBrand,
            updateBrand: handleUpdateBrand,
            deleteBrand: handleDeleteBrand,
        }}
        >
        {children}
        </BrandContext.Provider>
    );
};