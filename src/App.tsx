
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { UserAuthProvider } from "@/context/UserAuthContext";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminLogin from "@/pages/admin/AdminLogin";
import CategoriesManagement from "@/pages/admin/CategoriesManagement";
import CategoryForm from "@/pages/admin/CategoryForm";

// Pages
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import News from "./pages/News";
import NewsDetails from "./pages/NewsDetails";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import WhereToBuy from "./pages/WhereToBuy";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import NewsManagement from "./pages/admin/NewsManagement";
import NewsForm from "./pages/admin/NewsForm";
import ProductsManagement from "./pages/admin/ProductsManagement";
import ProductForm from "./pages/admin/ProductForm";
import OrdersManagement from "./pages/admin/OrdersManagement";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CartProvider>
            <AdminAuthProvider>
              <UserAuthProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/catalog/:categoryId" element={<CategoryProducts />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/where-to-buy" element={<WhereToBuy />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:id" element={<NewsDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/news" element={<ProtectedRoute><NewsManagement /></ProtectedRoute>} />
                  <Route path="/admin/news/create" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
                  <Route path="/admin/news/edit/:id" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
                  <Route path="/admin/products" element={<ProtectedRoute><ProductsManagement /></ProtectedRoute>} />
                  <Route path="/admin/products/create" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
                  <Route path="/admin/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
                  <Route path="/admin/products/edit/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
                  <Route path="/admin/orders" element={<ProtectedRoute><OrdersManagement /></ProtectedRoute>} />
                  
                  <Route path="/admin/categories" element={<ProtectedRoute><CategoriesManagement /></ProtectedRoute>} />
                  <Route path="/admin/categories/create" element={<ProtectedRoute><CategoryForm /></ProtectedRoute>} />
                  <Route path="/admin/categories/edit/:id" element={<ProtectedRoute><CategoryForm /></ProtectedRoute>} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </UserAuthProvider>
            </AdminAuthProvider>
          </CartProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
