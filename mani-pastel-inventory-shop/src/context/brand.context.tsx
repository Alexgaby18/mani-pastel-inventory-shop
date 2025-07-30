import { createContext, useEffect, useState } from 'react'; 
import { CreateBrand, UpdateBrand, Brand } from '@/interfaces/brand.interface'; 
import { createBrand, updateBrand, getBrandes, deleteBrand } from '../api/brand';  

interface BrandContextType {   
  brands: Brand[];     
  loading: boolean;     
  createBrand: (brand: CreateBrand) => Promise<void>;     
  updateBrand: (id: string, brand: UpdateBrand) => Promise<void>;     
  deleteBrand: (id: string) => Promise<void>; 
  fetchBrands: () => Promise<void>;
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
  fetchBrands: async () => {         
    throw new Error('fetchBrands() not implemented.');     
  }
});  

interface Props {   
  children: React.ReactNode; 
}  

export const BrandProvider: React.FC<Props> = ({ children }) => {     
  const [brands, setBrands] = useState<Brand[]>([]);     
  const [loading, setLoading] = useState(true);  
  const fetchBrands = async () => {
  try {
    setLoading(true);
    const brandsData = await getBrandes();
    setBrands(brandsData);
  } catch (error) {
    console.error('Error fetching brands:', error);
  } finally {
    setLoading(false);
  }
};        
  
  useEffect(() => {
    fetchBrands();
  }, []);         
  
  const handleCreateBrand = async (brand: CreateBrand) => {         
    try {
      const newBrand = await createBrand(brand);         
      setBrands((prev) => [...prev, newBrand]);
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error; // Re-lanzar para que el componente pueda manejarlo
    }
  };          
  
  const handleUpdateBrand = async (id: string, brand: UpdateBrand) => {         
    const updatedBrand = await updateBrand(id, brand);
      setBrands((prev) =>
        prev.map((p) => (p._id === id ? updatedBrand : p))
      );
    }
 
  
  const handleDeleteBrand = async (id: string) => {         
    try {
      await deleteBrand(id);         
      setBrands((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error; // Re-lanzar para que el componente pueda manejarlo
    }
  };          
  
  return (         
    <BrandContext.Provider         
      value={{             
        brands,             
        loading,             
        createBrand: handleCreateBrand,             
        updateBrand: handleUpdateBrand,             
        deleteBrand: handleDeleteBrand,   
        fetchBrands : fetchBrands,      
      }}         
    >         
      {children}         
    </BrandContext.Provider>     
  ); 
};