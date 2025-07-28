import { ChangeEvent, FormEvent, useState } from 'react';
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
  _id: string;
  code: string;
  name: string;
  stock: number;
  price: number;
  cost: number;
  flete: number;
  brand: string;
  unit_measure: string;
}

interface ProductsManagerProps {
  onBack: () => void;
}

export function ProductsManager({ onBack }: ProductsManagerProps) {
  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    codigo: '',
    nombre: '',
    stock: 0,
    precio: 0,
    costo: 0,
    flete: 0,
    marca_id: '',
    unidad_de_medida: 'Unidad'
  });
  const [editProduct, setEditProduct] = useState({
    codigo: '',
    nombre: '',
    stock: 0,
    precio: 0,
    costo: 0,
    flete: 0,
    marca_id: '',
    unidad_de_medida: 'Unidad'
  });

  // Hook del contexto
  const { products, createProduct, updateProduct, deleteProduct } = useProduct();

  const brands = [
    { id: "1", nombre: "Beauty Pro" },
    { id: "2", nombre: "Nail Art Express" },
    { id: "3", nombre: "Glam Nails" }
  ];

  const filteredProducts = products?.filter(
  (product: Product) =>
    typeof product.name === "string" &&
    typeof product.code === "string" &&
    (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
) || [];

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'out', color: 'bg-destructive text-destructive-foreground' };
    if (stock <= 5) return { status: 'low', color: 'bg-warning text-warning-foreground' };
    return { status: 'good', color: 'bg-success text-success-foreground' };
  };

  // Manejar cambios en el formulario de crear
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === 'stock' || name === 'precio' || name === 'costo' || name === 'flete' 
        ? parseFloat(value) || 0 
        : value
    });
  };

  // Manejar cambios en el formulario de editar
  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: name === 'stock' || name === 'precio' || name === 'costo' || name === 'flete' 
        ? parseFloat(value) || 0 
        : value
    });
  };

  // Manejar cambios en los selects para crear
  const handleSelectChange = (name: string, value: string) => {
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  // Manejar cambios en los selects para editar
  const handleEditSelectChange = (name: string, value: string) => {
    setEditProduct({
      ...editProduct,
      [name]: value
    });
  };

  // Abrir modal de edición
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditProduct({
      codigo: product.code,
      nombre: product.name,
      stock: product.stock,
      precio: product.price,
      costo: product.cost,
      flete: product.flete,
      marca_id: product.brand,
      unidad_de_medida: product.unit_measure
    });
    setIsEditDialogOpen(true);
  };

  // Manejar envío del formulario de crear
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newProduct.codigo && newProduct.nombre) {
      try {
        await handleCreateProduct({
          code: newProduct.codigo,
          name: newProduct.nombre,
          stock: newProduct.stock,
          price: newProduct.precio,
          cost: newProduct.costo,
          flete: newProduct.flete,
          brand: newProduct.marca_id,
          unit_measure: newProduct.unidad_de_medida
        });
        setNewProduct({
          codigo: '',
          nombre: '',
          stock: 0,
          precio: 0,
          costo: 0,
          flete: 0,
          marca_id: '',
          unidad_de_medida: 'Unidad'
        });
        setIsAddDialogOpen(false);
      } catch (error) {
        console.error('Error al crear producto:', error);
      }
    }
  };

  // Manejar envío del formulario de editar
  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editProduct.codigo && editProduct.nombre && editingProduct) {
      try {
        await handleUpdateProduct(editingProduct._id, {
          code: editProduct.codigo,
          name: editProduct.nombre,
          stock: editProduct.stock,
          price: editProduct.precio,
          cost: editProduct.costo,
          flete: editProduct.flete,
          brand: editProduct.marca_id,
          unit_measure: editProduct.unidad_de_medida
        });
        
        // Cerrar modal y limpiar estados
        setIsEditDialogOpen(false);
        setEditingProduct(null);
        setEditProduct({
          codigo: '',
          nombre: '',
          stock: 0,
          precio: 0,
          costo: 0,
          flete: 0,
          marca_id: '',
          unidad_de_medida: 'Unidad'
        });
      } catch (error) {
        console.error('Error al actualizar producto:', error);
      }
    }
  };

  // Funciones de manejo consistentes
  const handleCreateProduct = async (product: any) => {
    const newProduct = await createProduct(product);
    // Asumiendo que createProduct ya actualiza el estado local
  };

  const handleUpdateProduct = async (id: string, product: any) => {
    const updatedProduct = await updateProduct(id, product);
    // Asumiendo que updateProduct ya actualiza el estado local
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      // Asumiendo que deleteProduct ya actualiza el estado local
    } catch (error) {
      console.error('Error al eliminar producto:', error);
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
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código</Label>
                    <Input
                      id="codigo"
                      name="codigo"
                      value={newProduct.codigo}
                      onChange={handleChange}
                      placeholder="ESM001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={newProduct.nombre}
                      onChange={handleChange}
                      placeholder="Esmalte Rosa Claro"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio</Label>
                    <Input
                      id="precio"
                      name="precio"
                      type="number"
                      step="0.01"
                      value={newProduct.precio}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costo">Costo</Label>
                    <Input
                      id="costo"
                      name="costo"
                      type="number"
                      step="0.01"
                      value={newProduct.costo}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="flete">Flete</Label>
                    <Input
                      id="flete"
                      name="flete"
                      type="number"
                      step="0.01"
                      value={newProduct.flete}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Select 
                      value={newProduct.marca_id} 
                      onValueChange={(value) => handleSelectChange('marca_id', value)}
                    >
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
                    <Select 
                      value={newProduct.unidad_de_medida} 
                      onValueChange={(value) => handleSelectChange('unidad_de_medida', value)}
                    >
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
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Agregar Producto
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Modal de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifica la información del producto seleccionado
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-codigo">Código</Label>
                <Input
                  id="edit-codigo"
                  name="codigo"
                  value={editProduct.codigo}
                  onChange={handleEditChange}
                  placeholder="ESM001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nombre">Nombre</Label>
                <Input
                  id="edit-nombre"
                  name="nombre"
                  value={editProduct.nombre}
                  onChange={handleEditChange}
                  placeholder="Esmalte Rosa Claro"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  value={editProduct.stock}
                  onChange={handleEditChange}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-precio">Precio</Label>
                <Input
                  id="edit-precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  value={editProduct.precio}
                  onChange={handleEditChange}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-costo">Costo</Label>
                <Input
                  id="edit-costo"
                  name="costo"
                  type="number"
                  step="0.01"
                  value={editProduct.costo}
                  onChange={handleEditChange}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-flete">Flete</Label>
                <Input
                  id="edit-flete"
                  name="flete"
                  type="number"
                  step="0.01"
                  value={editProduct.flete}
                  onChange={handleEditChange}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-marca">Marca</Label>
                <Select 
                  value={editProduct.marca_id} 
                  onValueChange={(value) => handleEditSelectChange('marca_id', value)}
                >
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
                <Label htmlFor="edit-unidad">Unidad de Medida</Label>
                <Select 
                  value={editProduct.unidad_de_medida} 
                  onValueChange={(value) => handleEditSelectChange('unidad_de_medida', value)}
                >
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
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
          {filteredProducts.map((product: Product) => {
            const stockStatus = getStockStatus(product.stock);
            const brandName = brands.find(b => b.id === product.brand)?.nombre || 'Sin marca';
            
            return (
              <Card key={product._id} className="border-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">{product.name}</CardTitle>
                      <CardDescription>{product.code} • {brandName}</CardDescription>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
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