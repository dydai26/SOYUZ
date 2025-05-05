
import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";
import { Grid } from "lucide-react";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  console.log("ProductGrid - Products:", products);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <Grid className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500">Товари не знайдено</p>
          <p className="text-sm text-gray-400">У цій категорії поки немає товарів</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
