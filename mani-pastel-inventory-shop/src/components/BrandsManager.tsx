import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { useBrand } from '@/context/use.brand';
import { CreateBrand, UpdateBrand, Brand } from '@/interfaces/brand.interface';

interface BrandsManagerProps {
  onBack: () => void;
}

export function BrandsManager({ onBack }: BrandsManagerProps) {
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Puedes hacer esto configurable

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [editingBrand, setEditingBrand] = useState<{ id: string; name: string } | null>(null);
  const [editBrandData, setEditBrandData] = useState<CreateBrand>({ name: '' });

  const { brands, createBrand, updateBrand, deleteBrand, loading, fetchBrands } = useBrand();

  // Ordenar marcas por fecha de creación (más recientes primero) y filtrar
  const filteredBrands = brands
    ?.filter(
      (brand: Brand) =>
        typeof brand.name === "string" &&
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: Brand, b: Brand) => {
      // Asumiendo que las marcas tienen una fecha de creación
      const dateA = new Date(a.dateAdded || a._id).getTime();
      const dateB = new Date(b.dateAdded || b._id).getTime();
      return dateB - dateA; // Más recientes primero
    }) || [];

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBrands = filteredBrands.slice(startIndex, endIndex);

  // Funciones de paginación
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  // Reset page when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleAddBrand = async () => {
    if (newBrandName.trim()) {
      try {
        await createBrand({ name: newBrandName.trim() });
        setNewBrandName('');
        setIsAddDialogOpen(false);
        setCurrentPage(1); // Ir a la primera página para ver la nueva marca
      } catch (error) {
        console.error('Error creating brand:', error);
      }
    }
  };

  const handleEditBrand = (brand: { _id: string; name: string }) => {
    setEditingBrand({ id: brand._id, name: brand.name });
    setEditBrandData({ name: brand.name });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBrand = async () => {
    if (editingBrand && editBrandData.name.trim()) {
      try {
        await updateBrand(editingBrand.id, { name: editBrandData.name.trim() });
        await fetchBrands();
        setIsEditDialogOpen(false);
        setEditingBrand(null);
        setEditBrandData({ name: '' });
      } catch (error) {
        console.error('Error updating brand:', error);
      }
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      await deleteBrand(id);
      // Ajustar página si es necesario después de eliminar
      const newTotalPages = Math.ceil((filteredBrands.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-8 w-8 mx-auto mb-2 animate-spin" />
          <p>Cargando marcas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b shadow-sm p-4 bg-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-3 items-center">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Sparkles className="h-6 w-6" />
            <div>
              <h1 className="text-xl font-bold">Gestión de Marcas</h1>
              <p className="text-sm text-muted-foreground">
                Administra las marcas de tus productos ({filteredBrands.length} marcas)
              </p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Marca
              </Button>
            </DialogTrigger>
            <DialogContent className="mx-4">
              <DialogHeader>
                <DialogTitle>Agregar Nueva Marca</DialogTitle>
                <DialogDescription>Ingresa el nombre de la nueva marca</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Label htmlFor="brandName">Nombre de la Marca</Label>
                <Input
                  id="brandName"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="Beauty Pro"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddBrand()}
                />
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleAddBrand} 
                    className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
                  >
                    Agregar Marca
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Search */}
        <Card className="mb-6 border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar marca..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredBrands.length)} de {filteredBrands.length} marcas
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brands List */}
        <div className="grid gap-4 mb-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedBrands.map((brand) => (
            <Card key={brand._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="h-5 w-5" />
                    <div>
                      <CardTitle>{brand.name}</CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1" 
                    onClick={() => handleEditBrand(brand)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10" 
                    onClick={() => handleDeleteBrand(brand._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Card className="border-primary/20 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center space-x-2 overflow-x-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {/* Page numbers - Hidden on mobile */}
                  <div className="hidden sm:flex items-center space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                          className="w-8"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredBrands.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <Sparkles className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron marcas</h3>
              <p className="mb-4">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda.' 
                  : 'Comienza agregando tu primera marca.'
                }
              </p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)} 
                className="bg-accent hover:bg-accent/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Marca
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Brand Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="mx-4">
          <DialogHeader>
            <DialogTitle>Editar Marca</DialogTitle>
            <DialogDescription>Modifica el nombre de la marca</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="editBrandName">Nombre de la Marca</Label>
            <Input
              id="editBrandName"
              value={editBrandData.name}
              onChange={(e) => setEditBrandData({ name: e.target.value })}
              placeholder="Beauty Pro"
              onKeyPress={(e) => e.key === 'Enter' && handleUpdateBrand()}
            />
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateBrand} 
                className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
              >
                Actualizar Marca
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
