import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ProductProvider } from './context/product.context' // Ajusta la ruta si es necesario
import { BrandProvider } from './context/brand.context.tsx';

createRoot(document.getElementById("root")!).render(
  <BrandProvider>
  <ProductProvider>
    <App />
  </ProductProvider>
  </BrandProvider>
);