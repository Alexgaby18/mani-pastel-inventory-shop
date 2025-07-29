import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ProductProvider } from './context/product.context' // Ajusta la ruta si es necesario
import { BrandProvider } from './context/brand.context.tsx';
import { InvoiceProvider } from './context/invoice.context.tsx'; // Ajusta la ruta si es necesario

createRoot(document.getElementById("root")!).render(
  <InvoiceProvider>
    <ProductProvider>
      <BrandProvider>
        <App />
      </BrandProvider>
    </ProductProvider>
  </InvoiceProvider>
);