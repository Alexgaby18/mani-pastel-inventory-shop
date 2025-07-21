import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  Plus, 
  Search, 
  Eye, 
  Download,
  Calendar,
  User,
  Phone,
  DollarSign
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Invoice {
  id: string;
  nombre: string;
  ci: string;
  telefono: string;
  total: number;
  fecha: string;
  productos: InvoiceDetail[];
}

interface InvoiceDetail {
  factura_id: string;
  producto_codigo: string;
  cantidad: number;
  precio_unitario: number;
  sub_total: number;
  producto_nombre?: string;
}

interface InvoicesManagerProps {
  onBack: () => void;
}

export function InvoicesManager({ onBack }: InvoicesManagerProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV001",
      nombre: "María González",
      ci: "12345678",
      telefono: "555-0123",
      total: 65.97,
      fecha: "2025-01-12",
      productos: [
        {
          factura_id: "INV001",
          producto_codigo: "ESM001",
          cantidad: 2,
          precio_unitario: 15.99,
          sub_total: 31.98,
          producto_nombre: "Esmalte Rosa Claro"
        },
        {
          factura_id: "INV001",
          producto_codigo: "LIM002",
          cantidad: 1,
          precio_unitario: 12.99,
          sub_total: 12.99,
          producto_nombre: "Lima de Cristal Premium"
        }
      ]
    },
    {
      id: "INV002",
      nombre: "Ana Rodríguez",
      ci: "87654321",
      telefono: "555-0456",
      total: 24.99,
      fecha: "2025-01-12",
      productos: [
        {
          factura_id: "INV002",
          producto_codigo: "ACR003",
          cantidad: 1,
          precio_unitario: 24.99,
          sub_total: 24.99,
          producto_nombre: "Acrílico Transparente"
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    productos: []
  });

  const products = [
    { codigo: "ESM001", nombre: "Esmalte Rosa Claro", precio: 15.99, stock: 5 },
    { codigo: "LIM002", nombre: "Lima de Cristal Premium", precio: 12.99, stock: 0 },
    { codigo: "ACR003", nombre: "Acrílico Transparente", precio: 24.99, stock: 2 }
  ];

  const filteredInvoices = invoices.filter(invoice =>
    invoice.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.ci.includes(searchTerm) ||
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (productCode: string) => {
    const product = products.find(p => p.codigo === productCode);
    if (product && newInvoice.productos) {
      const existingProduct = newInvoice.productos.find(p => p.producto_codigo === productCode);
      
      if (existingProduct) {
        const updatedProducts = newInvoice.productos.map(p =>
          p.producto_codigo === productCode
            ? { ...p, cantidad: p.cantidad + 1, sub_total: (p.cantidad + 1) * p.precio_unitario }
            : p
        );
        setNewInvoice({ ...newInvoice, productos: updatedProducts });
      } else {
        const newDetail: InvoiceDetail = {
          factura_id: '',
          producto_codigo: productCode,
          cantidad: 1,
          precio_unitario: product.precio,
          sub_total: product.precio,
          producto_nombre: product.nombre
        };
        setNewInvoice({ 
          ...newInvoice, 
          productos: [...newInvoice.productos, newDetail] 
        });
      }
    }
  };

  const calculateTotal = () => {
    return newInvoice.productos?.reduce((total, item) => total + item.sub_total, 0) || 0;
  };

  const handleCreateInvoice = () => {
    if (newInvoice.nombre && newInvoice.ci && newInvoice.productos && newInvoice.productos.length > 0) {
      const invoiceId = newInvoice.id || `INV${String(invoices.length + 1).padStart(3, '0')}`;
      const invoice: Invoice = {
        id: invoiceId,
        nombre: newInvoice.nombre,
        ci: newInvoice.ci,
        telefono: newInvoice.telefono || '',
        total: calculateTotal(),
        fecha: new Date().toISOString().split('T')[0],
        productos: newInvoice.productos.map(p => ({ ...p, factura_id: invoiceId }))
      };
      
      setInvoices([invoice, ...invoices]);
      setNewInvoice({ productos: [] });
      setIsAddDialogOpen(false);
    }
  };

  const viewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-glow/10">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="bg-success/20 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-success-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Gestión de Facturas</h1>
              <p className="text-sm text-muted-foreground">Administra las ventas y facturas</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-success hover:bg-success/90 text-success-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Factura
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Crear Nueva Factura</DialogTitle>
                <DialogDescription>
                  Completa los datos del cliente y selecciona los productos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Invoice and Customer Data */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Número de Factura</Label>
                    <Input
                      id="invoiceNumber"
                      value={newInvoice.id || ''}
                      onChange={(e) => setNewInvoice({...newInvoice, id: e.target.value})}
                      placeholder="INV001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Nombre del Cliente</Label>
                    <Input
                      id="customerName"
                      value={newInvoice.nombre || ''}
                      onChange={(e) => setNewInvoice({...newInvoice, nombre: e.target.value})}
                      placeholder="María González"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerCI">CI/RUC</Label>
                    <Input
                      id="customerCI"
                      value={newInvoice.ci || ''}
                      onChange={(e) => setNewInvoice({...newInvoice, ci: e.target.value})}
                      placeholder="12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Teléfono</Label>
                    <Input
                      id="customerPhone"
                      value={newInvoice.telefono || ''}
                      onChange={(e) => setNewInvoice({...newInvoice, telefono: e.target.value})}
                      placeholder="555-0123"
                    />
                  </div>
                </div>

                {/* Add Products */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Agregar Productos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card key={product.codigo} 
                            className={`cursor-pointer hover:shadow-md transition-shadow ${
                              product.stock === 0 ? 'border-destructive bg-destructive/10' : 'border-success/30'
                            }`}
                            onClick={() => product.stock > 0 && handleAddProduct(product.codigo)}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">{product.nombre}</CardTitle>
                          <CardDescription>{product.codigo}</CardDescription>
                          {product.stock === 0 && (
                            <Badge variant="destructive" className="text-xs">
                              Sin Stock
                            </Badge>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-lg font-bold">${product.precio}</span>
                              <p className={`text-xs ${product.stock === 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                Stock: {product.stock}
                              </p>
                            </div>
                            <Button size="sm" variant="outline" disabled={product.stock === 0}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Selected Products */}
                {newInvoice.productos && newInvoice.productos.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Productos Seleccionados</h3>
                    <div className="space-y-2">
                      {newInvoice.productos.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <span className="font-medium">{item.producto_nombre}</span>
                            <span className="text-sm text-muted-foreground ml-2">({item.producto_codigo})</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span>Cantidad: {item.cantidad}</span>
                            <span>Precio: ${item.precio_unitario}</span>
                            <span className="font-bold">Subtotal: ${item.sub_total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold">Total: ${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateInvoice} className="bg-success hover:bg-success/90">
                    Crear Factura
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card className="lg:col-span-2 border-success/30">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar facturas por cliente, CI o número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-success/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Facturas Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {invoices.filter(inv => inv.fecha === new Date().toISOString().split('T')[0]).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-success/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${invoices.reduce((total, inv) => total + inv.total, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="border-success/30 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-success/20 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-success-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{invoice.id}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {invoice.nombre}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {invoice.telefono}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {invoice.fecha}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center text-lg font-bold text-foreground">
                        <DollarSign className="h-5 w-5 mr-1" />
                        {invoice.total.toFixed(2)}
                      </div>
                      <Badge variant="secondary" className="bg-success/20 text-success-foreground">
                        {invoice.productos.length} productos
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => viewInvoice(invoice)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInvoices.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron facturas</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Comienza creando tu primera factura.'}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-success hover:bg-success/90">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Factura
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Invoice Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Factura {selectedInvoice?.id}</DialogTitle>
            <DialogDescription>
              Detalles de la factura
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Cliente:</Label>
                  <p>{selectedInvoice.nombre}</p>
                </div>
                <div>
                  <Label className="font-semibold">CI/RUC:</Label>
                  <p>{selectedInvoice.ci}</p>
                </div>
                <div>
                  <Label className="font-semibold">Teléfono:</Label>
                  <p>{selectedInvoice.telefono}</p>
                </div>
                <div>
                  <Label className="font-semibold">Fecha:</Label>
                  <p>{selectedInvoice.fecha}</p>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Productos:</Label>
                <div className="space-y-2 mt-2">
                  {selectedInvoice.productos.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <span className="font-medium">{item.producto_nombre}</span>
                        <span className="text-sm text-muted-foreground ml-2">({item.producto_codigo})</span>
                      </div>
                      <div className="text-right">
                        <div>{item.cantidad} x ${item.precio_unitario}</div>
                        <div className="font-bold">${item.sub_total.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="text-right border-t pt-4">
                <span className="text-xl font-bold">Total: ${selectedInvoice.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}