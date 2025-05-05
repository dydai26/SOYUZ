import { supabase, getPublicImageUrl, uploadImage, deleteImage, ensureStorageBuckets } from "@/lib/supabase";
import { Product, ProductCategory, ProductDetails } from "@/types";

/**
 * Service for managing product data in Supabase
 */
export const ProductService = {
  /**
   * Initialize database and storage for products
   */
  async initialize(): Promise<boolean> {
    try {
      console.log("Initializing product service...");
      await ensureStorageBuckets();
      return true;
    } catch (error) {
      console.error("Error initializing product service:", error);
      return false;
    }
  },

  /**
   * Get all product categories
   */
  async getCategories(): Promise<ProductCategory[]> {
    console.log("ProductService - Fetching all categories");
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    console.log("ProductService - Retrieved categories:", data);
    return data.map(category => ({
      ...category,
      image: getPublicImageUrl(category.image)
    }));
  },
  
  /**
   * Get a specific category by ID
   */
  async getCategoryById(id: string): Promise<ProductCategory | null> {
    console.log("ProductService - Fetching category by ID:", id);
    if (!id) {
      console.error('Invalid category ID provided:', id);
      return null;
    }
    
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }
    
    console.log("ProductService - Retrieved category:", data);
    return {
      ...data,
      image: getPublicImageUrl(data.image)
    };
  },
  
  /**
   * Create a new product category
   */
  async createCategory(category: Omit<ProductCategory, 'id'>): Promise<ProductCategory | null> {
    const id = `cat-${Date.now()}`;
    
    const { data, error } = await supabase
      .from('product_categories')
      .insert({ id, ...category })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      return null;
    }
    
    return {
      ...data,
      image: getPublicImageUrl(data.image)
    };
  },
  
  /**
   * Update an existing product category
   */
  async updateCategory(id: string, category: Partial<ProductCategory>): Promise<boolean> {
    const { error } = await supabase
      .from('product_categories')
      .update(category)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating category:', error);
      return false;
    }
    
    return true;
  },
  
  /**
   * Delete a product category
   */
  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('product_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }
    
    return true;
  },
  
  /**
   * Get all products
   */
  async getProducts(): Promise<Product[]> {
    console.log("ProductService - Fetching all products");
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    
    console.log("ProductService - Retrieved products:", data);
    return data.map(product => ({
      ...product,
      price: Number(product.price),
      image: getPublicImageUrl(product.image),
      additionalImages: product.additional_images 
        ? product.additional_images.map(img => getPublicImageUrl(img))
        : [],
      categoryId: product.category_id,
      inStock: product.in_stock,
      articleNumber: product.article_number, // Map article_number to articleNumber
      createdAt: product.created_at,
      details: product.details as ProductDetails
    }));
  },
  
  /**
   * Get products by category
   */
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    console.log("ProductService - Fetching products by category ID:", categoryId);
    if (!categoryId) {
      console.error('Invalid category ID provided for getProductsByCategory:', categoryId);
      return [];
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');
    
    if (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
    
    console.log(`ProductService - Retrieved ${data.length} products for category ${categoryId}:`, data);
    return data.map(product => ({
      ...product,
      price: Number(product.price),
      image: getPublicImageUrl(product.image),
      additionalImages: product.additional_images 
        ? product.additional_images.map(img => getPublicImageUrl(img))
        : [],
      categoryId: product.category_id,
      inStock: product.in_stock,
      articleNumber: product.article_number, // Map article_number to articleNumber
      createdAt: product.created_at,
      details: product.details as ProductDetails
    }));
  },
  
  /**
   * Get a product by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    
    return {
      ...data,
      price: Number(data.price),
      image: getPublicImageUrl(data.image),
      additionalImages: data.additional_images 
        ? data.additional_images.map(img => getPublicImageUrl(img))
        : [],
      categoryId: data.category_id,
      inStock: data.in_stock,
      articleNumber: data.article_number, // Map article_number to articleNumber
      createdAt: data.created_at,
      details: data.details as ProductDetails
    };
  },
  
  /**
   * Create a new product
   */
  async createProduct(product: Omit<Product, 'id' | 'createdAt'>, customId?: string): Promise<Product | null> {
    // Use the provided customId or generate one
    const id = customId || `prod-${Date.now()}`;
    
    // Transform the product object to match Supabase schema
    const supabaseProduct = {
      id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      additional_images: product.additionalImages,
      category_id: product.categoryId,
      in_stock: product.inStock,
      article_number: product.articleNumber, // Store article number in database
      details: product.details
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert(supabaseProduct)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      return null;
    }
    
    return {
      ...data,
      price: Number(data.price),
      image: getPublicImageUrl(data.image),
      additionalImages: data.additional_images 
        ? data.additional_images.map(img => getPublicImageUrl(img))
        : [],
      categoryId: data.category_id,
      inStock: data.in_stock,
      articleNumber: data.article_number, // Map article_number to articleNumber
      createdAt: data.created_at,
      details: data.details as ProductDetails
    };
  },
  
  /**
   * Update an existing product
   */
  async updateProduct(id: string, product: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<boolean> {
    // Transform the product object to match Supabase schema
    const supabaseProduct: any = {};
    
    if (product.name !== undefined) supabaseProduct.name = product.name;
    if (product.description !== undefined) supabaseProduct.description = product.description;
    if (product.price !== undefined) supabaseProduct.price = product.price;
    if (product.image !== undefined) supabaseProduct.image = product.image;
    if (product.additionalImages !== undefined) supabaseProduct.additional_images = product.additionalImages;
    if (product.categoryId !== undefined) supabaseProduct.category_id = product.categoryId;
    if (product.inStock !== undefined) supabaseProduct.in_stock = product.inStock;
    if (product.articleNumber !== undefined) supabaseProduct.article_number = product.articleNumber;
    if (product.details !== undefined) supabaseProduct.details = product.details;
    
    const { error } = await supabase
      .from('products')
      .update(supabaseProduct)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating product:', error);
      return false;
    }
    
    return true;
  },
  
  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<boolean> {
    // First, get the product to delete its images if needed
    const product = await this.getProductById(id);
    
    if (product) {
      // Delete the main image
      if (product.image && !product.image.includes('placeholder')) {
        await deleteImage(product.image);
      }
      
      // Delete additional images
      if (product.additionalImages && product.additionalImages.length > 0) {
        for (const img of product.additionalImages) {
          if (img && !img.includes('placeholder')) {
            await deleteImage(img);
          }
        }
      }
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }
    
    return true;
  },
  
  /**
   * Upload a product image
   */
  async uploadProductImage(file: File): Promise<string | null> {
    // Initialize storage buckets if needed
    await this.initialize();
    
    try {
      // Use the correct path format for product images
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      return await uploadImage(file, fileName);
    } catch (error) {
      console.error("Error uploading product image:", error);
      return null;
    }
  },
  
  /**
   * Upload a category image
   */
  async uploadCategoryImage(file: File): Promise<string | null> {
    // Initialize storage buckets if needed
    await this.initialize();
    
    try {
      // Use the correct path format for category images
      const fileName = `categories-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      return await uploadImage(file, fileName);
    } catch (error) {
      console.error("Error uploading category image:", error);
      return null;
    }
  },
  
  /**
   * Delete a product image
   */
  async deleteProductImage(url: string): Promise<boolean> {
    return deleteImage(url);
  }
};
