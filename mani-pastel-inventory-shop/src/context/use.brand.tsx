import { useContext } from 'react';
import { BrandContext } from './brand.context';

export const useBrand = () => {
  const context = useContext(BrandContext);

  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
};