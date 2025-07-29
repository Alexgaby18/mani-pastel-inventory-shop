import { useState, useContext, useMemo } from 'react';
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
import { ProductContext } from '@/context/product.context';
import { InvoiceContext } from '@/context/invoice.context';
import { BrandContext } from '@/context/brand.context';

interface DashboardProps {
  email: string; 
  onLogout: () => void;
}

export function Dashboard({ email, onLogout }: DashboardProps) {
  const [activeSection, setActiveSection] = useState<'dashboard' | 'products' | 'brands' | 'invoices'>('dashboard');
  
  // Usar los contextos para obtener datos reales
  const { products } = useContext(ProductContext);
  const { invoices } = useContext(InvoiceContext);
  const { brands } = useContext(BrandContext);

  // Función helper para calcular tiempo transcurrido
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Ahora mismo";
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  };

  // Calcular estadísticas dinámicamente
  const stats = useMemo(() => {
    const totalProducts = products.length;
    
    // Productos con stock bajo (menor a 10 unidades o sin stock definido)
    const lowStockProducts = products.filter(product => 
      !product.stock || product.stock <= 5
    ).length;
    
    // Facturas de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayInvoices = invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.dateIssued);
      invoiceDate.setHours(0, 0, 0, 0);
      return invoiceDate.getTime() === today.getTime();
    });
    
    // Ingresos del día
    const todayRevenue = todayInvoices.reduce((total, invoice) => {
      return total + invoice.totalAmount;
    }, 0);

    return [
      {
        title: "Total Productos",
        value: totalProducts.toString(),
        icon: Package,
        description: "En inventario",
        color: "text-primary"
      },
      {
        title: "Stock Bajo",
        value: lowStockProducts.toString(),
        icon: AlertTriangle,
        description: "Requieren reposición",
        color: "text-warning"
      },
      {
        title: "Facturas Hoy",
        value: todayInvoices.length.toString(),
        icon: FileText,
        description: "Ventas del día",
        color: "text-success"
      },
      {
        title: "Ingresos",
        value: `$${todayRevenue.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
        icon: TrendingUp,
        description: "Total del día",
        color: "text-primary"
      }
    ];
  }, [products, invoices]);

  // Actividad reciente basada en datos reales
  const recentActivity = useMemo(() => {
    const activities = [];
    
    // Últimos productos agregados (usando dateAdded si existe)
    const recentProducts = [...products]
      .filter(product => product.dateAdded)
      .sort((a, b) => new Date(b.dateAdded!).getTime() - new Date(a.dateAdded!).getTime())
      .slice(0, 2);
    
    recentProducts.forEach(product => {
      const timeAgo = getTimeAgo(product.dateAdded!);
      activities.push({
        action: "Producto agregado",
        item: product.name,
        time: timeAgo,
        date: new Date(product.dateAdded!)
      });
    });
    
    // Últimas facturas
    const recentInvoices = [...invoices]
      .sort((a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime())
      .slice(0, 2);
    
    recentInvoices.forEach(invoice => {
      const timeAgo = getTimeAgo(invoice.dateIssued);
      activities.push({
        action: "Factura creada",
        item: `Venta #${invoice.invoiceNumber}`,
        time: timeAgo,
        date: new Date(invoice.dateIssued)
      });
    });
    
    // Últimas marcas agregadas
    const recentBrands = [...brands]
      .filter(brand => brand.dateAdded)
      .sort((a, b) => new Date(b.dateAdded!).getTime() - new Date(a.dateAdded!).getTime())
      .slice(0, 1);
    
    recentBrands.forEach(brand => {
      const timeAgo = getTimeAgo(brand.dateAdded!);
      activities.push({
        action: "Marca agregada",
        item: brand.name,
        time: timeAgo,
        date: new Date(brand.dateAdded!)
      });
    });
    
    // Ordenar todas las actividades por fecha más reciente
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 3);
  }, [products, invoices, brands, getTimeAgo]);

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
              <p className="text-sm text-muted-foreground">Bienvenida {email}</p>
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
                  <Package className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-accent-foreground">Gestionar Productos</CardTitle>
                  <CardDescription>
                    Administra tu inventario de productos de manicura
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-primary/10 text-accent-foreground">
                  {products.length} productos
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
                  {brands.length} marcas
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
                  <FileText className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <CardTitle className="text-accent-foreground">Facturas</CardTitle>
                  <CardDescription>
                    Gestiona las ventas y facturas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-success/20 text-accent-foreground">
                  {stats[2].value} hoy
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
            <CardDescription>Últimos movimientos en el inventario y ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.item}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No hay actividad reciente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}