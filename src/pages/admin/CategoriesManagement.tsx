
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { ProductService } from "@/services/productService";
import { ProductCategory } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CategoriesManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [categoryToDelete, setCategoryToDelete] = useState<ProductCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  
  // Fetch categories
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: ProductService.getCategories
  });
  
  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Категорію видалено",
        description: `Категорія "${categoryToDelete?.name}" була успішно видалена.`,
      });
      setCategoryToDelete(null);
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast({
        title: "Помилка видалення",
        description: "Не вдалося видалити категорію",
        variant: "destructive"
      });
    }
  });
  
  const handleDelete = async () => {
    if (categoryToDelete) {
      deleteMutation.mutate(categoryToDelete.id);
      setIsDialogOpen(false);
    }
  };
  
  const openDeleteDialog = (category: ProductCategory) => {
    setCategoryToDelete(category);
    setIsDialogOpen(true);
  };
  
  if (error) {
    return (
      <AdminLayout>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-lg font-semibold text-red-800">Помилка завантаження</h2>
          <p className="text-red-600">Не вдалося завантажити категорії. Спробуйте оновити сторінку.</p>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">Управління категоріями</h1>
          <Button onClick={() => navigate("/admin/categories/create")} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Створити категорію
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="shadow-sm">
                <div className="h-40 bg-gray-200 animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category) => (
              <Card key={category.id} className="shadow-sm overflow-hidden">
                <div className="aspect-[16/9] bg-gray-100 relative">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </CardContent>
                <CardFooter className="flex justify-end p-4 pt-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Редагувати
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    onClick={() => openDeleteDialog(category)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Видалити
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 md:p-10 border rounded-md bg-gray-50">
            <p className="text-gray-500 mb-4">Жодної категорії не знайдено.</p>
            <Button onClick={() => navigate("/admin/categories/create")}>
              <Plus className="h-4 w-4 mr-2" /> Створити першу категорію
            </Button>
          </div>
        )}
      </div>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
            <AlertDialogDescription>
              Ця дія видалить категорію "{categoryToDelete?.name}" безповоротно.
              При видаленні категорії всі пов'язані товари також будуть видалені.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Скасувати</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={deleteMutation.isPending}
              className="w-full sm:w-auto"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Видаляємо...
                </>
              ) : (
                "Так, видалити"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default CategoriesManagement;
