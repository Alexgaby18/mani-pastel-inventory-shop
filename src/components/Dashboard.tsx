import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  Sparkles,
  LogOut,
  Plus,
  Search
} from 'lucide-react';
import { ProductsManager } from './ProductsManager';
import { BrandsManager } from './BrandsManager';
import { InvoicesManager } from './InvoicesManager';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export function Dashboard({ username, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'products' | 'brands' | 'invoices'>('dashboard');

  const stats = [
    {
      title: "Total Productos",
      value: "156",
      icon: Package,
      description: "En inventario",
      color: "text-primary"
    },
    {
      title: "Stock Bajo",
      value: "8",
      icon: AlertTriangle,
      description: "Requieren reposición",
      color: "text-warning"
    },
    {
      title: "Facturas Hoy",
      value: "12",
      icon: FileText,
      description: "Ventas del día",
      color: "text-success"
    },
    {
      title: "Ingresos",
      value: "$2,450",
      icon: TrendingUp,
      description: "Total del día",
      color: "text-primary"
    }
  ];

  if (activeSection === 'products') {
    return <ProductsManager onBack={() => setActiveSection('dashboard')} />;
  }

  if (activeSection === 'brands') {
    return <BrandsManager onBack={() => setActiveSection('dashboard')} />;
  }

  if (activeSection === 'invoices') {
    return <InvoicesManager onBack={() => setActiveSection('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-glow/10">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Liey Nails</h1>
              <p className="text-sm text-muted-foreground">Bienvenida, {username}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-primary/30"
            onClick={() => setActiveSection('products')}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-primary">Gestionar Productos</CardTitle>
                  <CardDescription>
                    Administra tu inventario de productos de manicura
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  156 productos
                </Badge>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-accent/50"
            onClick={() => setActiveSection('brands')}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-accent/20 p-3 rounded-lg">
                  <Sparkles className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-accent-foreground">Gestionar Marcas</CardTitle>
                  <CardDescription>
                    Administra las marcas de tus productos
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                  24 marcas
                </Badge>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-success/50"
            onClick={() => setActiveSection('invoices')}
          >
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="bg-success/20 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-success-foreground" />
                </div>
                <div>
                  <CardTitle className="text-success-foreground">Facturas</CardTitle>
                  <CardDescription>
                    Gestiona las ventas y facturas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-success/20 text-success-foreground">
                  12 hoy
                </Badge>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Nueva
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Actividad Reciente</CardTitle>
            <CardDescription>Últimos movimientos en el inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "Stock actualizado", item: "Esmalte Rosa Claro", time: "Hace 10 min" },
                { action: "Producto agregado", item: "Lima de Cristal Premium", time: "Hace 1 hora" },
                { action: "Factura creada", item: "Venta #001234", time: "Hace 2 horas" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.item}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}