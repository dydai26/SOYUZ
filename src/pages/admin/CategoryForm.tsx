
import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Upload, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ProductCategory } from "@/types";
import { ProductService } from "@/services/productService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CategoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const isEditing = id !== undefined;

  const [category, setCategory] = useState<ProductCategory>({
    id: "",
    name: "",
    image: "/placeholder.svg"
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Fetch category if editing
  const { isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => ProductService.getCategoryById(id!),
    enabled: isEditing,
    meta: {
      onSuccess: (data: ProductCategory | null) => {
        if (data) {
          setCategory(data);
          setImagePreview(data.image);
        } else {
          toast({
            title: "Помилка",
            description: "Категорію не знайдено",
            variant: "destructive"
          });
          navigate("/admin/categories");
        }
      }
    }
  });

  // Mutation for creating/updating category
  const mutation = useMutation({
    mutationFn: async (data: { id?: string; category: Partial<ProductCategory> }) => {
      if (data.id) {
        return ProductService.updateCategory(data.id, data.category);
      }
      return ProductService.createCategory(data.category as Omit<ProductCategory, 'id'>);
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Категорію оновлено" : "Категорію створено",
        description: `Категорія "${category.name}" була успішно ${isEditing ? "оновлена" : "створена"}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate("/admin/categories");
    },
    onError: (error) => {
      console.error("Error saving category:", error);
      toast({
        title: "Помилка збереження",
        description: "Не вдалося зберегти категорію",
        variant: "destructive"
      });
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category.name) {
      toast({
        title: "Помилка",
        description: "Заповніть назву категорії",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      let imageUrl = category.image;
      if (imageFile) {
        setIsUploading(true);
        console.log("Uploading category image:", imageFile.name);
        // Завантажуємо зображення та отримуємо URL
        imageUrl = await ProductService.uploadCategoryImage(imageFile) || imageUrl;
        console.log("Uploaded image URL:", imageUrl);
        setIsUploading(false);
      }
      
      const categoryData: Partial<ProductCategory> = {
        name: category.name,
        image: imageUrl
      };
      
      if (isEditing && id) {
        mutation.mutate({ id, category: categoryData });
      } else {
        mutation.mutate({ category: categoryData as Omit<ProductCategory, 'id'> });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти категорію",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Add Effect to handle the success of the query manually
  React.useEffect(() => {
    const query = queryClient.getQueryData(['category', id]);
    if (query && isEditing) {
      setCategory(query as ProductCategory);
      setImagePreview((query as ProductCategory).image);
    }
  }, [queryClient, id, isEditing]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-10 mr-4" />
            <Skeleton className="h-10 w-64" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate("/admin/categories")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Назад
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Редагувати категорію" : "Створити нову категорію"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Назва категорії</Label>
                <Input
                  id="name"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Зображення категорії</Label>
                <div className="mt-2 border rounded-md p-4 bg-gray-50">
                  <div className="w-full h-64 bg-white border rounded-md overflow-hidden mb-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Попередній перегляд"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Завантаження...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" /> Завантажити зображення
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => navigate("/admin/categories")}
              disabled={isSaving}
            >
              Скасувати
            </Button>
            <Button type="submit" disabled={isSaving || isUploading || mutation.isPending}>
              {(isSaving || mutation.isPending) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Збереження...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> {isEditing ? "Оновити" : "Створити"} категорію
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CategoryForm;
