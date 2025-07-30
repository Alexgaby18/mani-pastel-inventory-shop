import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { Dashboard } from "./components/Dashboard";
import { BrandsManager } from "./components/BrandsManager";
import { InvoicesManager } from "./components/InvoicesManager";
import { ProductsManager } from "./components/ProductsManager";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const queryClient = new QueryClient();

// Tipo para los datos del usuario
interface UserData {
  username: string;
  email: string;
}

// Componente wrapper para manejar las rutas protegidas
const ProtectedRoute = ({ 
  children, 
  user 
}: { 
  children: React.ReactNode; 
  user: UserData | null; 
}) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Componente para manejar la navegación en las rutas protegidas
const ProtectedRouteWithNavigation = ({ 
  children, 
  user 
}: { 
  children: React.ReactNode; 
  user: UserData | null; 
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Clonamos el elemento hijo y le pasamos la función onBack
  return React.cloneElement(children as React.ReactElement, { onBack: handleBack });
};

const AppContent = () => {
  const [user, setUser] = useState<UserData | null>(null);

  // Verificar si hay un usuario guardado al cargar la aplicación
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        // Si hay error al parsear, limpiar datos corruptos
        sessionStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = (userData: { username: string; email: string }) => {
    setUser(userData);
    // Guardar en sessionStorage para persistir durante la sesión
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    // Limpiar el sessionStorage y localStorage
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <Routes>
      {/* Ruta pública */}
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <LoginForm onLogin={handleLogin} />
          )
        } 
      />
      
      {/* Rutas protegidas */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute user={user}>
            <Dashboard username={user?.username || ''} onLogout={handleLogout} />
          </ProtectedRoute>
        } 
      />
      
      {/* <Route 
        path="/marcas" 
        element={
          <ProtectedRouteWithNavigation user={user}>
            <BrandsManager onBack={() => {}} />
          </ProtectedRouteWithNavigation>
        } 
      />
      
      <Route 
        path="/facturas" 
        element={
          <ProtectedRouteWithNavigation user={user}>
            <InvoicesManager onBack={() => {}} />
          </ProtectedRouteWithNavigation>
        } 
      />
      
      <Route 
        path="/productos" 
        element={
          <ProtectedRouteWithNavigation user={user}>
            <ProductsManager onBack={() => {}} />
          </ProtectedRouteWithNavigation>
        } 
      /> */}

      {/* Ruta para páginas no encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
