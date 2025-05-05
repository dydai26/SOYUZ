
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
  };
  
  // Ensure product links use the correct format
  const productPath = `/products/${product.id}`;
  
  return (
    <div className="product-card bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link to={productPath}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={productPath}>
          <h3 className="text-lg text-[#3A3C99] font-semibold line-clamp-1 hover:text-[#3A3C99] transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-[#3A3C99] mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
          <Button size="sm" className="bg-[#3A3C99] hover:bg-opacity-80" onClick={handleAddToCart}>
            <ShoppingCart className="h-4 w-4 mr-1" /> Купити
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
