import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Search, 
  Edit, 
  Trash2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Brand {
  id: string;
  nombre: string;
  productCount?: number;
}

interface BrandsManagerProps {
  onBack: () => void;
}

export function BrandsManager({ onBack }: BrandsManagerProps) {
  const [brands, setBrands] = useState<Brand[]>([
    { id: "1", nombre: "Beauty Pro", productCount: 45 },
    { id: "2", nombre: "Nail Art Express", productCount: 32 },
    { id: "3", nombre: "Glam Nails", productCount: 28 },
    { id: "4", nombre: "Professional Care", productCount: 19 },
    { id: "5", nombre: "Luxury Nails", productCount: 15 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  const filteredBrands = brands.filter(brand =>
    brand.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBrand = () => {
    if (newBrandName.trim()) {
      const newBrand: Brand = {
        id: Date.now().toString(),
        nombre: newBrandName.trim(),
        productCount: 0
      };
      
      setBrands([...brands, newBrand]);
      setNewBrandName('');
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteBrand = (id: string) => {
    setBrands(brands.filter(brand => brand.id !== id));
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
            <div className="bg-accent/20 p-2 rounded-lg">
              <Sparkles className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Gestión de Marcas</h1>
              <p className="text-sm text-muted-foreground">Administra las marcas de tus productos</p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Marca
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Marca</DialogTitle>
                <DialogDescription>
                  Ingresa el nombre de la nueva marca
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Nombre de la Marca</Label>
                  <Input
                    id="brandName"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="Beauty Pro"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddBrand()}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddBrand} className="bg-accent hover:bg-accent/90">
                    Agregar Marca
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-6">
        {/* Search */}
        <Card className="mb-6 border-accent/30">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar marcas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Marcas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{brands.length}</div>
            </CardContent>
          </Card>
          <Card className="border-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Productos Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {brands.reduce((total, brand) => total + (brand.productCount || 0), 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Promedio por Marca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {brands.length > 0 ? Math.round(brands.reduce((total, brand) => total + (brand.productCount || 0), 0) / brands.length) : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Brands List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="border-accent/30 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-accent/20 p-2 rounded-lg">
                      <Sparkles className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{brand.nombre}</CardTitle>
                      <CardDescription>ID: {brand.id}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Productos:</span>
                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                      {brand.productCount || 0} productos
                    </Badge>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteBrand(brand.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron marcas</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Comienza agregando tu primera marca.'}
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Marca
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}