import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Upload, Plus, Trash2, Loader2 } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Product, ProductDetails, ProductCategory } from "@/types";
import { ProductService } from "@/services/productService";
import { Skeleton } from "@/components/ui/skeleton";

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const isEditing = id !== undefined;

  const emptyProduct: Product = {
    id: "",
    name: "",
    description: "",
    price: 0,
    image: "/placeholder.svg",
    additionalImages: [],
    categoryId: "",
    inStock: true,
    createdAt: new Date().toISOString(),
    articleNumber: "", // Added article number with default empty string
    details: {
      weight: "",
      expirationDays: 0,
      calories: 0,
      packaging: "",
      proteins: 0,
      fats: 0,
      carbs: 0,
      storageConditions: "",
      ingredients: "",
      piecesInPackage: 0,
      manufacturer: "ТОВ \"Виробник Плюс\"",
      countryOfOrigin: "Україна"
    }
  };

  const [product, setProduct] = useState<Product>(emptyProduct);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        console.log("Loading categories...");
        const categoriesData = await ProductService.getCategories();
        console.log("Categories loaded:", categoriesData);
        setCategories(categoriesData);
        
        if (categoriesData.length === 0) {
          const defaultCategories = [
            { id: "cat-oatmeal", name: "Вівсяне печиво", image: "/placeholder.svg" },
            { id: "cat-corn", name: "Кукурудзяне печиво", image: "/placeholder.svg" },
            { id: "cat-sushka", name: "Сушка", image: "/placeholder.svg" },
            { id: "cat-rusks", name: "Сухарі", image: "/placeholder.svg" },
            { id: "cat-confectionery", name: "Кондитерські вироби", image: "/placeholder.svg" },
            { id: "cat-candies", name: "Цукерки", image: "/placeholder.svg" },
            { id: "cat-cakes", name: "Торти і тістечка", image: "/placeholder.svg" },
            { id: "cat-diet", name: "Дієтичне печиво", image: "/placeholder.svg" }
          ];
          
          console.log("No categories found, adding default categories:", defaultCategories);
          
          for (const category of defaultCategories) {
            await ProductService.createCategory(category);
          }
          
          const updatedCategories = await ProductService.getCategories();
          setCategories(updatedCategories);
          console.log("Updated categories after adding defaults:", updatedCategories);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        toast({
          title: "Помилка завантаження категорій",
          description: "Не вдалося завантажити категорії товарів",
          variant: "destructive"
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    loadCategories();
  }, [toast]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (isEditing && id) {
          const productData = await ProductService.getProductById(id);
          if (productData) {
            setProduct(productData);
            setMainImagePreview(productData.image || "");
            setAdditionalImagePreviews(productData.additionalImages || []);
          } else {
            toast({
              title: "Помилка",
              description: "Товар не знайдено",
              variant: "destructive"
            });
            navigate("/admin/products");
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Помилка завантаження",
          description: "Не вдалося завантажити дані",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, isEditing, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setProduct((prev) => ({ ...prev, inStock: checked }));
  };

  const handleCategoryChange = (value: string) => {
    console.log("Category selected:", value);
    setProduct((prev) => ({ ...prev, categoryId: value }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      details: {
        ...prev.details!,
        [name]: value
      }
    }));
  };

  const handleDetailsNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      details: {
        ...prev.details!,
        [name]: parseFloat(value) || 0
      }
    }));
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setMainImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setAdditionalImageFiles((prev) => [...prev, ...fileArray]);
      
      for (const file of fileArray) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setAdditionalImagePreviews((prev) => [...prev, result]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeAdditionalImage = (index: number) => {
    if (index < additionalImagePreviews.length - additionalImageFiles.length) {
      const urlToRemove = additionalImagePreviews[index];
      
      setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
      setProduct(prev => ({
        ...prev,
        additionalImages: prev.additionalImages?.filter(url => url !== urlToRemove) || []
      }));
    } else {
      const fileIndex = index - (additionalImagePreviews.length - additionalImageFiles.length);
      setAdditionalImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
      setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product.name || !product.categoryId) {
      toast({
        title: "Помилка",
        description: "Заповніть обов'язкові поля: назва та категорія",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      let mainImageUrl = product.image;
      if (mainImageFile) {
        setIsUploading(true);
        mainImageUrl = await ProductService.uploadProductImage(mainImageFile) || mainImageUrl;
        setIsUploading(false);
      }
      
      let additionalImagesUrls = [...(product.additionalImages || [])];
      if (additionalImageFiles.length > 0) {
        setIsUploading(true);
        for (const file of additionalImageFiles) {
          const url = await ProductService.uploadProductImage(file);
          if (url) additionalImagesUrls.push(url);
        }
        setIsUploading(false);
      }
      
      const productToSave: Omit<Product, 'id' | 'createdAt'> = {
        name: product.name,
        description: product.description,
        price: product.price,
        image: mainImageUrl,
        additionalImages: additionalImagesUrls,
        categoryId: product.categoryId,
        inStock: product.inStock,
        articleNumber: product.articleNumber, // Added article number
        details: product.details
      };
      
      let success = false;
      
      if (isEditing && id) {
        success = await ProductService.updateProduct(id, productToSave);
      } else {
        // If there's an article number, use it as ID, otherwise generate one
        const customId = product.articleNumber ? 
          product.articleNumber.trim() : 
          `prod-${Date.now()}`;
          
        const newProduct = await ProductService.createProduct(productToSave, customId);
        success = !!newProduct;
      }
      
      if (success) {
        toast({
          title: isEditing ? "Товар оновлено" : "Товар створено",
          description: `Товар "${product.name}" був успішно ${isEditing ? "оновлений" : "створений"}.`,
        });
        navigate("/admin/products");
      } else {
        throw new Error(isEditing ? "Failed to update product" : "Failed to create product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Помилка збереження",
        description: "Не вдалося зберегти товар",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-10 mr-4" />
            <Skeleton className="h-10 w-64" />
          </div>
          <Skeleton className="h-8 w-64 mb-4" />
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
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Назад
          </Button>
          <h1 className="text-3xl font-bold">
            {isEditing ? "Редагувати товар" : "Створити новий товар"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="basic">
            <TabsList className="mb-4">
              <TabsTrigger value="basic">Основна інформація</TabsTrigger>
              <TabsTrigger value="details">Характеристики</TabsTrigger>
              <TabsTrigger value="images">Зображення</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Назва товару</Label>
                    <Input
                      id="name"
                      name="name"
                      value={product.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  {/* Add Article Number field */}
                  <div className="space-y-2">
                    <Label htmlFor="articleNumber">Артикул</Label>
                    <Input
                      id="articleNumber"
                      name="articleNumber"
                      value={product.articleNumber || ""}
                      onChange={handleChange}
                      placeholder="Введіть артикул товару (наприклад: 155)"
                    />
                    <p className="text-sm text-muted-foreground">
                      {isEditing ? 
                        "Увага! Зміна артикулу не впливає на ID товару в системі." : 
                        "Якщо залишити порожнім, артикул буде згенеровано автоматично."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryId">Категорія</Label>
                    <Select
                      value={product.categoryId}
                      onValueChange={handleCategoryChange}
                      disabled={isLoadingCategories}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть категорію" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingCategories ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Завантаження категорій...</span>
                          </div>
                        ) : categories.length > 0 ? (
                          categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            Категорії не знайдено
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    {categories.length === 0 && !isLoadingCategories && (
                      <p className="text-sm text-red-500 mt-1">
                        Немає доступних категорій. Спершу створіть категорії в розділі управління.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Ціна (грн)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={handleNumberChange}
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={product.inStock}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <Label htmlFor="inStock">В наявності</Label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="description">Опис товару</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Вага</Label>
                    <Input
                      id="weight"
                      name="weight"
                      value={product.details?.weight || ""}
                      onChange={handleDetailsChange}
                      placeholder="250 г"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="calories">Енергетична цінність (ккал/100г)</Label>
                    <Input
                      id="calories"
                      name="calories"
                      type="number"
                      min="0"
                      value={product.details?.calories || 0}
                      onChange={handleDetailsNumberChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="proteins">Білки (г/100г)</Label>
                    <Input
                      id="proteins"
                      name="proteins"
                      type="number"
                      min="0"
                      step="0.1"
                      value={product.details?.proteins || 0}
                      onChange={handleDetailsNumberChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fats">Жири (г/100г)</Label>
                    <Input
                      id="fats"
                      name="fats"
                      type="number"
                      min="0"
                      step="0.1"
                      value={product.details?.fats || 0}
                      onChange={handleDetailsNumberChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Вуглеводи (г/100г)</Label>
                    <Input
                      id="carbs"
                      name="carbs"
                      type="number"
                      min="0"
                      step="0.1"
                      value={product.details?.carbs || 0}
                      onChange={handleDetailsNumberChange}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="packaging">Упакування</Label>
                    <Input
                      id="packaging"
                      name="packaging"
                      value={product.details?.packaging || ""}
                      onChange={handleDetailsChange}
                      placeholder="Картонна коробка"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expirationDays">Термін придатності (днів)</Label>
                    <Input
                      id="expirationDays"
                      name="expirationDays"
                      type="number"
                      min="0"
                      value={product.details?.expirationDays || 0}
                      onChange={handleDetailsNumberChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="piecesInPackage">Кількість штук в упаковці</Label>
                    <Input
                      id="piecesInPackage"
                      name="piecesInPackage"
                      type="number"
                      min="0"
                      value={product.details?.piecesInPackage || 0}
                      onChange={handleDetailsNumberChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="storageConditions">Умови зберігання</Label>
                    <Textarea
                      id="storageConditions"
                      name="storageConditions"
                      value={product.details?.storageConditions || ""}
                      onChange={handleDetailsChange}
                      rows={2}
                      placeholder="Зберігати у сухому, захищеному від світла місці при температурі не вище +25°C"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Склад</Label>
                    <Textarea
                      id="ingredients"
                      name="ingredients"
                      value={product.details?.ingredients || ""}
                      onChange={handleDetailsChange}
                      rows={2}
                      placeholder="Борошно пшеничне вищого ґатунку, цукор, яйця, маргарин, сіль, ваніль, дріжджі"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="images" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Основне зображення</Label>
                    <div className="mt-2 border rounded-md p-4 bg-gray-50">
                      <div className="w-full h-64 bg-white border rounded-md overflow-hidden mb-4">
                        <img
                          src={mainImagePreview || "/placeholder.svg"}
                          alt="Попередній перегляд"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleMainImageUpload}
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
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Додаткові зображення</Label>
                    <div className="mt-2 border rounded-md p-4 bg-gray-50">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        {additionalImagePreviews.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="w-full h-24 bg-white border rounded-md overflow-hidden">
                              <img
                                src={image}
                                alt={`Додаткове зображення ${index + 1}`}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeAdditionalImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                        
                        <div 
                          className="w-full h-24 bg-white border border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50"
                          onClick={() => additionalImagesInputRef.current?.click()}
                        >
                          <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                      </div>
                      
                      <input
                        type="file"
                        ref={additionalImagesInputRef}
                        onChange={handleAdditionalImagesUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                      />
                      
                      <Button
                        type="button"
                        onClick={() => additionalImagesInputRef.current?.click()}
                        className="w-full"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Завантаження...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" /> Додати зображення
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => navigate("/admin/products")}
              disabled={isSaving}
            >
              Скасувати
            </Button>
            <Button type="submit" disabled={isSaving || isUploading}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Збереження...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> {isEditing ? "Оновити" : "Створити"} товар
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
