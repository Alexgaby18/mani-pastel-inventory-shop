import { ChangeEvent, FormEvent, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
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
import { useProduct } from "@/context/use.product";
import { Product } from "@/interfaces/product.interface";
import { useBrand } from "@/context/use.brand";

interface ProductsManagerProps {
  onBack: () => void;
}

export function ProductsManager({ onBack }: ProductsManagerProps) {
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Estados locales
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    codigo: "",
    nombre: "",
    stock: 0,
    precio: 0,
    costo: 0,
    flete: 0,
    marca_id: "",
    unidad_de_medida: "Unidad",
  });
  const [editProduct, setEditProduct] = useState({
    codigo: "",
    nombre: "",
    stock: 0,
    precio: 0,
    costo: 0,
    flete: 0,
    marca_id: "",
    unidad_de_medida: "Unidad",
  });

  // Hook del contexto
  const { products, createProduct, updateProduct, deleteProduct } =
    useProduct();
  const { brands, loading: brandsLoading } = useBrand();
  const [duplicateCodeError, setDuplicateCodeError] = useState(false);

  // Ordenar y filtrar productos
  const filteredProducts =
    products
      ?.filter(
        (product: Product) =>
          typeof product.name === "string" &&
          typeof product.code === "string" &&
          (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.code.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a: Product, b: Product) => {
        const dateA = new Date(a.dateAdded || a._id).getTime();
        const dateB = new Date(b.dateAdded || b._id).getTime();
        return dateB - dateA;
      }) || [];

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Funciones de paginación
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        status: "out",
        color: "bg-destructive text-destructive-foreground",
      };
    if (stock <= 5)
      return { status: "low", color: "bg-warning text-warning-foreground" };
    return { status: "good", color: "bg-success text-success-foreground" };
  };

  // Manejar cambios en los formularios
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]:
        name === "stock" ||
        name === "precio" ||
        name === "costo" ||
        name === "flete"
          ? parseFloat(value) || 0
          : value,
    });
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]:
        name === "stock" ||
        name === "precio" ||
        name === "costo" ||
        name === "flete"
          ? parseFloat(value) || 0
          : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  };

  const handleEditSelectChange = (name: string, value: string) => {
    setEditProduct({
      ...editProduct,
      [name]: value,
    });
  };

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
      unidad_de_medida: product.unit_measure,
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const codeExists = products?.some(
      (product: Product) =>
        product.code &&
        product.code.toLowerCase() === newProduct.codigo.toLowerCase()
    );

    if (codeExists) {
      setDuplicateCodeError(true);
      return;
    }

    setDuplicateCodeError(false);

    if (newProduct.codigo && newProduct.nombre) {
      try {
        await createProduct({
          code: newProduct.codigo,
          name: newProduct.nombre,
          stock: newProduct.stock,
          price: newProduct.precio,
          cost: newProduct.costo,
          flete: newProduct.flete,
          brand: newProduct.marca_id,
          unit_measure: newProduct.unidad_de_medida,
        });
        setNewProduct({
          codigo: "",
          nombre: "",
          stock: 0,
          precio: 0,
          costo: 0,
          flete: 0,
          marca_id: "",
          unidad_de_medida: "Unidad",
        });
        setIsAddDialogOpen(false);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error al crear producto:", error);
      }
    }
  };

  const handleEditSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const codeExists = products?.some(
      (product: Product) =>
        product.code &&
        product.code.toLowerCase() === editProduct.codigo.toLowerCase() &&
        product._id !== editingProduct?._id
    );

    if (codeExists) {
      setDuplicateCodeError(true);
      return;
    }

    setDuplicateCodeError(false);

    if (editProduct.codigo && editProduct.nombre && editingProduct) {
      try {
        await updateProduct(editingProduct._id, {
          code: editProduct.codigo,
          name: editProduct.nombre,
          stock: editProduct.stock,
          price: editProduct.precio,
          cost: editProduct.costo,
          flete: editProduct.flete,
          brand: editProduct.marca_id,
          unit_measure: editProduct.unidad_de_medida,
        });

        setIsEditDialogOpen(false);
        setEditingProduct(null);
        setEditProduct({
          codigo: "",
          nombre: "",
          stock: 0,
          precio: 0,
          costo: 0,
          flete: 0,
          marca_id: "",
          unidad_de_medida: "Unidad",
        });
      } catch (error) {
        console.error("Error al actualizar producto:", error);
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      const newTotalPages = Math.ceil(
        (filteredProducts.length - 1) / itemsPerPage
      );
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

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
            <Package className="h-6 w-6" />
            <div>
              <h1 className="text-xl font-bold">Gestión de Productos</h1>
              <p className="text-sm text-muted-foreground">
                Administra tu inventario de productos ({filteredProducts.length}{" "}
                productos)
              </p>
            </div>
          </div>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) setDuplicateCodeError(false);
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-2xl mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                <DialogDescription>
                  Completa la información del nuevo producto
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 px-1 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código</Label>
                    <Input
                      id="codigo"
                      name="codigo"
                      value={newProduct.codigo}
                      onChange={(e) => {
                        setDuplicateCodeError(false);
                        handleChange(e);
                      }}
                      placeholder="ESM001"
                      required
                    />
                    {duplicateCodeError && (
                      <p className="text-sm text-destructive flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Este código ya está en uso. Por favor, ingresa uno
                        diferente.
                      </p>
                    )}
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
                      onValueChange={(value) =>
                        handleSelectChange("marca_id", value)
                      }
                      disabled={brandsLoading}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            brandsLoading
                              ? "Cargando marcas..."
                              : "Selecciona una marca"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {brandsLoading ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            Cargando marcas...
                          </div>
                        ) : (
                          brands.map((brand) => (
                            <SelectItem key={brand._id} value={brand._id}>
                              {brand.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidad">Unidad de Medida</Label>
                    <Select
                      value={newProduct.unidad_de_medida}
                      onValueChange={(value) =>
                        handleSelectChange("unidad_de_medida", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unidad">Unidad</SelectItem>
                        <SelectItem value="Paquete">Paquete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 bg-background pb-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
                  >
                    Agregar Producto
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Modal de Edición */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setDuplicateCodeError(false);
        }}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-2xl mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifica la información del producto seleccionado
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 px-1 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Campos del formulario (se mantienen igual) */}
              <div className="space-y-2">
                <Label htmlFor="edit-codigo">Código</Label>
                <Input
                  id="edit-codigo"
                  name="codigo"
                  value={editProduct.codigo}
                  onChange={(e) => {
                    setDuplicateCodeError(false);
                    handleEditChange(e);
                  }}
                  placeholder="ESM001"
                  required
                />
                {duplicateCodeError && (
                  <p className="text-sm text-destructive flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Este código ya está en uso. Por favor, ingresa uno
                    diferente.
                  </p>
                )}
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
                  onValueChange={(value) =>
                    handleEditSelectChange("marca_id", value)
                  }
                  disabled={brandsLoading}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        brandsLoading
                          ? "Cargando marcas..."
                          : "Selecciona una marca"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {brandsLoading ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Cargando marcas...
                      </div>
                    ) : (
                      brands.map((brand) => (
                        <SelectItem key={brand._id} value={brand._id}>
                          {brand.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-unidad">Unidad de Medida</Label>
                <Select
                  value={editProduct.unidad_de_medida}
                  onValueChange={(value) =>
                    handleEditSelectChange("unidad_de_medida", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unidad">Unidad</SelectItem>
                    <SelectItem value="Paquete">Paquete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2 bg-background pb-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
              >
                Guardar Cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="p-4 sm:p-6">
        {/* Search and Filters */}
        <Card className="mb-6 border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos por nombre o código..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                Mostrando {startIndex + 1}-
                {Math.min(endIndex, filteredProducts.length)} de{" "}
                {filteredProducts.length} productos
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {paginatedProducts.map((product: Product) => {
            const stockStatus = getStockStatus(product.stock);
            const brandName =
              brands.find((b) => b._id === product.brand)?.name || "Sin marca";

            return (
              <Card
                key={product._id}
                className="border-primary/20 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-foreground">
                        {product.name}
                      </CardTitle>
                      <CardDescription>
                        {product.code} • {brandName}
                      </CardDescription>
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
                      <span className="font-medium text-foreground">
                        ${product.price}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Costo:</span>
                      <span className="font-medium text-foreground">
                        ${product.cost}
                      </span>
                    </div>
                    {stockStatus.status === "out" && (
                      <div className="flex items-center text-destructive text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Sin Stock - Requiere reposición
                      </div>
                    )}
                    {stockStatus.status === "low" && (
                      <div className="flex items-center text-warning text-sm">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Stock bajo - Requiere reposición
                      </div>
                    )}
                    {stockStatus.status === "good" && (
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
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
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

        {filteredProducts.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <Package className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No se encontraron productos
              </h3>
              <p className="mb-4">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda."
                  : "Comienza agregando tu primer producto."}
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-accent hover:bg-accent/90"
              >
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
