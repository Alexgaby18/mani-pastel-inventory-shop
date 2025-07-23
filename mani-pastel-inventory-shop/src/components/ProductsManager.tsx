import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  AlertTriangle,
  CheckCircle
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
import { useProduct } from '@/context/use.product';

interface Product {
  codigo: string;
  nombre: string;
  stock: number;
  precio: number;
  costo: number;
  flete: number;
  marca_id: string;
  unidad_de_medida: string;
}

interface ProductsManagerProps {
  onBack: () => void;
}

export function ProductsManager({ onBack }: ProductsManagerProps) {
  const { products, createProduct } = useProduct();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  const brands = [
    { id: "1", nombre: "Beauty Pro" },
    { id: "2", nombre: "Nail Art Express" },
    { id: "3", nombre: "Glam Nails" }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'out', color: 'bg-destructive text-destructive-foreground' };
    if (stock <= 5) return { status: 'low', color: 'bg-warning text-warning-foreground' };
    return { status: 'good', color: 'bg-success text-success-foreground' };
  };

  const handleAddProduct = async () => {
  if (newProduct.codigo && newProduct.nombre) {
    await createProduct({
      code: newProduct.codigo,
      name: newProduct.nombre,
      stock: newProduct.stock || 0,
      price: newProduct.precio || 0,
      cost: newProduct.costo || 0,
      flete: newProduct.flete || 0,
      branch: newProduct.marca_id || "",
      unit_measure: newProduct.unidad_de_medida || "Unidad"
    });
    setNewProduct({});
    setIsAddDialogOpen(false);
  }
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
            <div className="bg-primary/10 p-2 rounded-lg">
              <Package className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Gestión de Productos</h1>
              <p className="text-sm text-muted-foreground">Administra tu inventario de productos</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                <DialogDescription>
                  Completa la información del nuevo producto
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código</Label>
                  <Input
                    id="codigo"
                    value={newProduct.codigo || ''}
                    onChange={(e) => setNewProduct({...newProduct, codigo: e.target.value})}
                    placeholder="ESM001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={newProduct.nombre || ''}
                    onChange={(e) => setNewProduct({...newProduct, nombre: e.target.value})}
                    placeholder="Esmalte Rosa Claro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock || 0}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio</Label>
                  <Input
                    id="precio"
                    type="number"
                    step="0.01"
                    value={newProduct.precio || 0}
                    onChange={(e) => setNewProduct({...newProduct, precio: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costo">Costo</Label>
                  <Input
                    id="costo"
                    type="number"
                    step="0.01"
                    value={newProduct.costo || 0}
                    onChange={(e) => setNewProduct({...newProduct, costo: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flete">Flete</Label>
                  <Input
                    id="flete"
                    type="number"
                    step="0.01"
                    value={newProduct.flete || 0}
                    onChange={(e) => setNewProduct({...newProduct, flete: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Select value={newProduct.marca_id} onValueChange={(value) => setNewProduct({...newProduct, marca_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidad">Unidad de Medida</Label>
                  <Select value={newProduct.unidad_de_medida} onValueChange={(value) => setNewProduct({...newProduct, unidad_de_medida: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Unidad">Unidad</SelectItem>
                      <SelectItem value="Gramos">Gramos</SelectItem>
                      <SelectItem value="Mililitros">Mililitros</SelectItem>
                      <SelectItem value="Paquete">Paquete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddProduct} className="bg-primary hover:bg-primary/90">
                  Agregar Producto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <Card className="mb-6 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            const brandName = brands.find(b => b.id === product.branch)?.nombre || 'Sin marca';
            
            return (
              <Card key={product.code} className="border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{product.name}</CardTitle>
                      <CardDescription>{product.code} • {product.branch}</CardDescription>
                    </div>
                    <Badge className={stockStatus.color}>
                      {product.stock} {product.unit_measure}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Precio:</span>
                      <span className="font-medium text-foreground">${product.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Costo:</span>
                      <span className="font-medium text-foreground">${product.cost}</span>
                    </div>
                    {stockStatus.status === 'out' && (
                      <div className="flex items-center text-destructive text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Sin Stock - Requiere reposición
                      </div>
                    )}
                    {stockStatus.status === 'low' && (
                      <div className="flex items-center text-warning text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Stock bajo - Requiere reposición
                      </div>
                    )}
                    {stockStatus.status === 'good' && (
                      <div className="flex items-center text-success text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Stock disponible
                      </div>
                    )}
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Comienza agregando tu primer producto.'}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}