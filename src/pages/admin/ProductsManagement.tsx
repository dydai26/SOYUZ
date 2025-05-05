
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle, 
  XCircle, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  ArrowUpDown,
  Loader2 
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Product, ProductCategory } from "@/types";
import { ProductService } from "@/services/productService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        ProductService.getProducts(),
        ProductService.getCategories()
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Помилка завантаження",
        description: "Не вдалося завантажити дані товарів",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCategoryName(product.categoryId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get category name from ID
  function getCategoryName(categoryId: string): string {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Невідома категорія";
  }

  const handleDeleteProduct = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await ProductService.deleteProduct(id);
      
      if (success) {
        setProducts(products.filter((product) => product.id !== id));
        toast({
          title: "Товар видалено",
          description: "Товар був успішно видалений з системи",
          variant: "default",
        });
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Помилка видалення",
        description: "Не вдалося видалити товар",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setProductToDelete(null);
    }
  };

  const toggleProductStatus = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const newStatus = !product.inStock;
    
    setIsLoading(true);
    try {
      const success = await ProductService.updateProduct(id, { inStock: newStatus });
      
      if (success) {
        setProducts(
          products.map((p) =>
            p.id === id ? { ...p, inStock: newStatus } : p
          )
        );
        
        toast({
          title: `Статус оновлено`,
          description: `Товар "${product.name}" тепер ${newStatus ? 'в наявності' : 'не в наявності'}`,
        });
      } else {
        throw new Error("Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast({
        title: "Помилка оновлення",
        description: "Не вдалося оновити статус товару",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format price to Ukrainian currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Управління товарами</h1>
          <Button asChild>
            <Link to="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" /> Додати товар
            </Link>
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex">
            <Input
              type="text"
              placeholder="Пошук товарів..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mr-2"
            />
            <Button>
              <Search className="h-4 w-4 mr-2" /> Пошук
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead className="min-w-[200px]">
                  <div className="flex items-center">
                    Назва <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Категорія</TableHead>
                <TableHead className="text-right">Ціна</TableHead>
                <TableHead>Наявність</TableHead>
                <TableHead className="text-right">Дії</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-gray-100 mr-3 overflow-hidden flex-shrink-0">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="truncate max-w-[300px]">{product.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                    <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                    <TableCell>
                      {product.inStock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="mr-1 h-3 w-3" /> В наявності
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="mr-1 h-3 w-3" /> Немає
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleProductStatus(product.id)}
                        >
                          {product.inStock ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/products/edit/${product.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setProductToDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="text-gray-500">Товари не знайдено</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити товар?</AlertDialogTitle>
            <AlertDialogDescription>
              Ця дія не може бути відмінена. Товар буде видалено з системи.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => productToDelete && handleDeleteProduct(productToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Видалити
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default ProductsManagement;
