import { useState, useEffect, useContext, useRef } from "react";
import { InvoiceContext } from "@/context/invoice.context";
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
  FileText,
  Plus,
  Search,
  Eye,
  Download,
  Calendar,
  User,
  Phone,
  DollarSign,
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
import { CreateInvoice, Invoice } from "@/interfaces/invoice.interface";
import { Product } from "@/interfaces/product.interface";
import { ProductContext } from "@/context/product.context";
import { usePDF } from "react-to-pdf";

interface InvoicesManagerProps {
  onBack: () => void;
}

// Componente para mostrar el PDF
const InvoicePDF = ({
  invoice,
  pdfRef,
}: {
  invoice: Invoice;
  pdfRef: React.RefObject<HTMLDivElement>;
}) => {
  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString();
  };

  return (
    <div
      ref={pdfRef}
      className="p-6"
      style={{ width: "210mm", height: "297mm" }}
    >
      <h1 className="text-2xl font-bold mb-4">
        Factura {invoice.invoiceNumber}
      </h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p>
            <strong>Cliente:</strong> {invoice.customerName}
          </p>
          <p>
            <strong>CI/RIF:</strong> {invoice.idCard}
          </p>
        </div>
        <div>
          <p>
            <strong>Fecha:</strong> {formatDate(invoice.dateIssued)}
          </p>
          <p>
            <strong>Teléfono:</strong> {invoice.customerPhone || "N/A"}
          </p>
        </div>
      </div>

      <table className="w-full mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Producto</th>
            <th className="text-right py-2">Cantidad</th>
            <th className="text-right py-2">Precio Unitario</th>
            <th className="text-right py-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{item.itemName}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">
                ${item.pricePerItem.toFixed(2)}
              </td>
              <td className="text-right py-2">
                ${(item.quantity * item.pricePerItem).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-xl font-bold">
        Total: ${invoice.totalAmount.toFixed(2)}
      </div>
    </div>
  );
};

export function InvoicesManager({ onBack }: InvoicesManagerProps) {
  // Contextos
  const { invoices, createInvoice } = useContext(InvoiceContext);
  const { products, getProducts } = useContext(ProductContext);

  // Estados de paginación para facturas
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Estados de paginación para productos en el modal
  const [productPage, setProductPage] = useState(1);
  const [productItemsPerPage] = useState(12);
  const [productSearchTerm, setProductSearchTerm] = useState("");

  // Estados
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState<CreateInvoice>({
    invoiceNumber: "",
    customerName: "",
    idCard: "",
    customerPhone: "",
    totalAmount: 0,
    items: [],
  });
  const [invoiceNumberError, setInvoiceNumberError] = useState("");
  const [formErrors, setFormErrors] = useState({
    customerName: "",
    idCard: "",
    items: "",
  });
  const [pdfInvoice, setPdfInvoice] = useState<Invoice | null>(null);

  const { toPDF, targetRef } = usePDF({
    filename: "factura.pdf",
    page: {
      margin: 20,
      format: "A4",
    },
  });
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

  // Función para obtener el nombre del producto por ID
  const getProductNameById = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    return product ? product.name : "Producto no encontrado";
  };

  // Procesar facturas y ordenar por más recientes primero
  const processedInvoices = invoices
    .map((invoice) => ({
      ...invoice,
      dateIssued: invoice.dateIssued ? new Date(invoice.dateIssued) : new Date(),
      items: invoice.items.map((item) => ({
        ...item,
        productName: getProductNameById(item.itemName),
      })),
    }))
    .sort((a, b) => {
      // Ordenar por fecha más reciente primero
      return new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime();
    });

  // Función para formatear fechas
  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString();
  };

  // Función para comparar fechas
  const isSameDate = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await getProducts();
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Validar número de factura
  const validateInvoiceNumber = (value: string) => {
    if (!value.trim()) {
      setInvoiceNumberError("El número de factura es requerido");
      return false;
    }

    const exists = invoices.some(
      (inv) => inv.invoiceNumber.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      setInvoiceNumberError("Este número de factura ya existe");
      return false;
    }

    setInvoiceNumberError("");
    return true;
  };

  // Validar formulario completo
  const isFormValid = () => {
    return (
      newInvoice.invoiceNumber.trim() &&
      newInvoice.customerName.trim() &&
      newInvoice.idCard.trim() &&
      newInvoice.items.length > 0 &&
      !invoiceNumberError &&
      !formErrors.customerName &&
      !formErrors.idCard
    );
  };

  // Filtrar facturas
  const filteredInvoices = processedInvoices.filter(
    (invoice) =>
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.idCard.includes(searchTerm) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación de facturas
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  // Funciones de paginación para facturas
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  // Filtrar y paginar productos para el modal
  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(productSearchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Ordenar por stock disponible primero, luego por nombre
      if (a.stock > 0 && b.stock <= 0) return -1;
      if (a.stock <= 0 && b.stock > 0) return 1;
      return a.name.localeCompare(b.name);
    });

  const totalProductPages = Math.ceil(filteredProducts.length / productItemsPerPage);
  const productStartIndex = (productPage - 1) * productItemsPerPage;
  const productEndIndex = productStartIndex + productItemsPerPage;
  const paginatedProductsForModal = filteredProducts.slice(productStartIndex, productEndIndex);

  // Funciones de paginación para productos
  const goToProductPage = (page: number) => {
    setProductPage(Math.max(1, Math.min(page, totalProductPages)));
  };

  const goToFirstProductPage = () => goToProductPage(1);
  const goToLastProductPage = () => goToProductPage(totalProductPages);
  const goToNextProductPage = () => goToProductPage(productPage + 1);
  const goToPreviousProductPage = () => goToProductPage(productPage - 1);

  // Reset pages when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleProductSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductSearchTerm(e.target.value);
    setProductPage(1);
  };

  // Agregar producto a la factura
  const handleAddProduct = (productId: string) => {
    const product = products.find((p) => p._id === productId);
    if (!product || (product.stock || 0) <= 0) return;

    setNewInvoice((prev) => {
      const existingItem = prev.items.find(
        (item) => item.itemName === productId
      );

      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      if (product.stock < newQuantity) {
        alert(
          `No hay suficiente stock de ${product.name}. Stock disponible: ${product.stock}`
        );
        return prev;
      }

      const updatedItems = existingItem
        ? prev.items.map((item) =>
            item.itemName === productId
              ? {
                  ...item,
                  quantity: newQuantity,
                  pricePerItem: product.price,
                }
              : item
          )
        : [
            ...prev.items,
            {
              itemName: productId,
              quantity: 1,
              pricePerItem: product.price,
            },
          ];

      const totalAmount = updatedItems.reduce(
        (total, item) => total + item.quantity * item.pricePerItem,
        0
      );

      return {
        ...prev,
        items: updatedItems,
        totalAmount,
      };
    });

    if (formErrors.items) {
      setFormErrors((prev) => ({ ...prev, items: "" }));
    }
  };

  // Validar campo genérico
  const validateField = (name: string, value: string) => {
    if (!value.trim()) {
      setFormErrors((prev) => ({ ...prev, [name]: "Este campo es requerido" }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    return true;
  };

  // Crear nueva factura
  const handleCreateInvoice = async () => {
    const isInvoiceNumberValid = validateInvoiceNumber(
      newInvoice.invoiceNumber
    );
    const isCustomerNameValid = validateField(
      "customerName",
      newInvoice.customerName
    );
    const isIdCardValid = validateField("idCard", newInvoice.idCard);
    const hasItems = newInvoice.items.length > 0;

    if (!hasItems) {
      setFormErrors((prev) => ({
        ...prev,
        items: "Debe agregar al menos un producto",
      }));
    }

    if (
      !isInvoiceNumberValid ||
      !isCustomerNameValid ||
      !isIdCardValid ||
      !hasItems
    ) {
      return;
    }

    try {
      await createInvoice(newInvoice);
      setNewInvoice({
        invoiceNumber: "",
        customerName: "",
        idCard: "",
        customerPhone: "",
        totalAmount: 0,
        items: [],
      });
      setIsAddDialogOpen(false);
      setCurrentPage(1); // Ir a la primera página para ver la nueva factura
      setProductPage(1); // Reset product page
      setProductSearchTerm(""); // Reset product search
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Error al crear la factura");
    }
  };

  // Ver detalle de factura
  const viewInvoice = (invoice: Invoice) => {
    setSelectedInvoice({
      ...invoice,
      dateIssued:
        invoice.dateIssued instanceof Date
          ? invoice.dateIssued
          : new Date(invoice.dateIssued),
      items: invoice.items.map((item) => ({
        ...item,
        itemName: getProductNameById(item.itemName),
      })),
    });
    setIsViewDialogOpen(true);
  };

  // Descargar PDF
  const handleDownloadPDF = (invoice: Invoice) => {
    const processedInvoice = {
      ...invoice,
      dateIssued: invoice.dateIssued instanceof Date ? invoice.dateIssued : new Date(invoice.dateIssued),
      items: invoice.items.map((item) => ({
        ...item,
        itemName: getProductNameById(item.itemName),
      })),
    };
    
    setPdfInvoice(processedInvoice);
    
    setTimeout(() => {
      toPDF();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-glow/10">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="bg-success/20 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-accent-foreground">
                Gestión de Facturas
              </h1>
              <p className="text-sm text-muted-foreground">
                Administra las ventas y facturas ({filteredInvoices.length} facturas)
              </p>
            </div>
          </div>
          <Dialog 
            open={isAddDialogOpen} 
            onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setProductPage(1);
                setProductSearchTerm("");
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-success hover:bg-success/90 text-accent-foreground">
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
                {/* Datos de la factura y cliente */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Número de Factura*</Label>
                    <Input
                      id="invoiceNumber"
                      value={newInvoice.invoiceNumber}
                      onChange={(e) => {
                        setNewInvoice({
                          ...newInvoice,
                          invoiceNumber: e.target.value,
                        });
                        validateInvoiceNumber(e.target.value);
                      }}
                      placeholder="FAC-001"
                      className={invoiceNumberError ? "border-destructive" : ""}
                    />
                    {invoiceNumberError && (
                      <p className="text-sm text-destructive">
                        {invoiceNumberError}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Nombre del Cliente*</Label>
                    <Input
                      id="customerName"
                      value={newInvoice.customerName}
                      onChange={(e) => {
                        setNewInvoice({
                          ...newInvoice,
                          customerName: e.target.value,
                        });
                        validateField("customerName", e.target.value);
                      }}
                      placeholder="Nombre completo"
                      className={
                        formErrors.customerName ? "border-destructive" : ""
                      }
                    />
                    {formErrors.customerName && (
                      <p className="text-sm text-destructive">
                        {formErrors.customerName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="idCard">Cédula/RIF*</Label>
                    <Input
                      id="idCard"
                      value={newInvoice.idCard}
                      onChange={(e) => {
                        setNewInvoice({
                          ...newInvoice,
                          idCard: e.target.value,
                        });
                        validateField("idCard", e.target.value);
                      }}
                      placeholder="1234567890"
                      className={formErrors.idCard ? "border-destructive" : ""}
                    />
                    {formErrors.idCard && (
                      <p className="text-sm text-destructive">
                        {formErrors.idCard}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Teléfono</Label>
                    <Input
                      id="customerPhone"
                      value={newInvoice.customerPhone}
                      onChange={(e) =>
                        setNewInvoice({
                          ...newInvoice,
                          customerPhone: e.target.value,
                        })
                      }
                      placeholder="0991234567"
                    />
                  </div>
                </div>

                {/* Lista de productos disponibles con paginación */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Productos Disponibles</h3>
                    <div className="text-sm text-muted-foreground">
                      {filteredProducts.length} productos encontrados
                    </div>
                  </div>
                  
                  {/* Búsqueda de productos */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar productos por nombre o código..."
                      value={productSearchTerm}
                      onChange={handleProductSearchChange}
                      className="pl-10"
                    />
                  </div>

                  {isLoadingProducts ? (
                    <div>Cargando productos...</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {paginatedProductsForModal.map((product) => {
                          const itemInInvoice = newInvoice.items.find(
                            (item) => item.itemName === product._id
                          );
                          const currentQuantity = itemInInvoice
                            ? itemInInvoice.quantity
                            : 0;
                          const hasStock = (product.stock || 0) > currentQuantity;

                          return (
                            <Card
                              key={product._id}
                              className={`cursor-pointer hover:shadow-md transition-shadow ${
                                !hasStock
                                  ? "border-destructive bg-destructive/10"
                                  : "border-success/30"
                              }`}
                              onClick={() =>
                                hasStock && handleAddProduct(product._id)
                              }
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">
                                  {product.name}
                                </CardTitle>
                                <CardDescription>{product.code}</CardDescription>
                                {!hasStock && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Sin Stock suficiente
                                  </Badge>
                                )}
                              </CardHeader>
                              <CardContent>
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-lg font-bold">
                                      ${product.price.toFixed(2)}
                                    </span>
                                    <p
                                      className={`text-xs ${
                                        !hasStock
                                          ? "text-destructive"
                                          : "text-muted-foreground"
                                      }`}
                                    >
                                      Stock: {product.stock || 0} | En factura:{" "}
                                      {currentQuantity}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={!hasStock}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      {/* Paginación de productos */}
                      {totalProductPages > 1 && (
                        <div className="flex items-center justify-between mt-4">
                          <div className="text-sm text-muted-foreground">
                            Página {productPage} de {totalProductPages} | 
                            Mostrando {productStartIndex + 1}-{Math.min(productEndIndex, filteredProducts.length)} de {filteredProducts.length}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToFirstProductPage}
                              disabled={productPage === 1}
                            >
                              <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToPreviousProductPage}
                              disabled={productPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            <span className="text-sm">
                              {productPage} / {totalProductPages}
                            </span>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToNextProductPage}
                              disabled={productPage === totalProductPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToLastProductPage}
                              disabled={productPage === totalProductPages}
                            >
                              <ChevronsRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Productos seleccionados */}
                {newInvoice.items.length > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Productos Seleccionados
                    </h3>
                    <div className="space-y-2">
                      {newInvoice.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <span className="font-medium">
                              {getProductNameById(item.itemName)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span>Cantidad: {item.quantity}</span>
                            <span>Precio: ${item.pricePerItem.toFixed(2)}</span>
                            <span className="font-bold">
                              Subtotal: $
                              {(item.quantity * item.pricePerItem).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold">
                        Total: ${newInvoice.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  formErrors.items && (
                    <div className="text-center py-4 text-destructive">
                      {formErrors.items}
                    </div>
                  )
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateInvoice}
                    className="bg-success hover:bg-success/90"
                    disabled={!isFormValid()}
                  >
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
              <div className="flex items-center justify-between space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar facturas por cliente, CI o número..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, filteredInvoices.length)} de {filteredInvoices.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Facturas Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {
                  processedInvoices.filter((inv) =>
                    isSameDate(inv.dateIssued, new Date())
                  ).length
                }
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Ingresos del Día
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                $
                {todayRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <div className="space-y-4 mb-6">
          {paginatedInvoices.map((invoice) => (
            <Card
              key={invoice._id}
              className="border-success/30 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-success/20 p-3 rounded-lg">
                      <FileText className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {invoice.invoiceNumber}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {invoice.customerName}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {invoice.customerPhone || "N/A"}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(invoice.dateIssued)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center text-lg font-bold text-foreground">
                        <DollarSign className="h-5 w-5 mr-1" />
                        {invoice.totalAmount.toFixed(2)}
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-success/20 text-accent-foreground"
                      >
                        {invoice.items.length} productos
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewInvoice(invoice)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(invoice)}
                      >
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Card className="border-success/30 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center space-x-2">
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
                  
                  {/* Page numbers */}
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

        {filteredInvoices.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No se encontraron facturas
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda."
                  : "Comienza creando tu primera factura."}
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-success hover:bg-success/90"
              >
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
            <DialogTitle>Factura {selectedInvoice?.invoiceNumber}</DialogTitle>
            <DialogDescription>Detalles de la factura</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Cliente:</Label>
                  <p>{selectedInvoice.customerName}</p>
                </div>
                <div>
                  <Label className="font-semibold">CI/RIF:</Label>
                  <p>{selectedInvoice.idCard}</p>
                </div>
                <div>
                  <Label className="font-semibold">Teléfono:</Label>
                  <p>{selectedInvoice.customerPhone}</p>
                </div>
                <div>
                  <Label className="font-semibold">Fecha:</Label>
                  <p>{formatDate(selectedInvoice.dateIssued)}</p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Productos:</Label>
                <div className="space-y-2 mt-2">
                  {selectedInvoice.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{item.itemName}</span>
                      </div>
                      <div className="text-right">
                        <div>
                          {item.quantity} x ${item.pricePerItem.toFixed(2)}
                        </div>
                        <div className="font-bold">
                          ${(item.quantity * item.pricePerItem).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right border-t pt-4">
                <span className="text-xl font-bold">
                  Total: ${selectedInvoice.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Componente PDF oculto */}
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "210mm",
          height: "297mm",
        }}
      >
        {pdfInvoice && <InvoicePDF invoice={pdfInvoice} pdfRef={targetRef} />}
      </div>
    </div>
  );
}
