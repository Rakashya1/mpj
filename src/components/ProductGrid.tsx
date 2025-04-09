import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import QuickViewDialog from "./QuickViewDialog";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

interface ProductGridProps {
  products?: Product[];
  onAddToCart?: (product: Product) => void;
  filters?: {
    categories: string[];
    priceRange: [number, number];
    minRating: number;
  };
  sortOption?: "newest" | "price-low-high" | "price-high-low" | "popularity";
}

const ProductGrid = ({
  products = mockProducts,
  onAddToCart = () => {},
  filters = { categories: [], priceRange: [0, 1000], minRating: 0 },
  sortOption = "newest",
}: ProductGridProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [isLoading, setIsLoading] = useState(false);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    setIsLoading(true);

    // Filter products based on criteria
    let result = [...products];

    // Apply category filter if any categories are selected
    if (filters.categories.length > 0) {
      result = result.filter((product) =>
        filters.categories.includes(product.category),
      );
    }

    // Apply price range filter
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1],
    );

    // Apply rating filter
    result = result.filter((product) => product.rating >= filters.minRating);

    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        // Assuming products are already sorted by newest in the API
        break;
    }

    // Simulate network delay
    setTimeout(() => {
      setFilteredProducts(result);
      setIsLoading(false);
    }, 300);
  }, [products, filters, sortOption]);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Handle quick view and add to cart
  const handleQuickView = (id: string) => {
    const product = filteredProducts.find((p) => p.id === id);
    if (product) {
      setQuickViewProduct(product);
      setIsQuickViewOpen(true);
    }
  };

  const handleAddToCart = (id: string) => {
    const product = filteredProducts.find((p) => p.id === id);
    if (product) {
      onAddToCart(product);
    }
  };

  return (
    <div className="w-full bg-background p-4">
      <QuickViewDialog
        product={quickViewProduct}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
        onAddToCart={handleAddToCart}
      />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="h-80 rounded-md bg-muted">
              <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  rating={product.rating}
                  category={product.category}
                  onAddToCart={handleAddToCart}
                  onQuickView={handleQuickView}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-muted-foreground">
                No products found
              </h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Mock data for default display
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 199.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    rating: 4.5,
    category: "electronics",
  },
  {
    id: "2",
    name: "Ergonomic Office Chair",
    price: 249.99,
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&q=80",
    rating: 4.2,
    category: "furniture",
  },
  {
    id: "3",
    name: "Smart Watch Series 5",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
    rating: 4.7,
    category: "electronics",
  },
  {
    id: "4",
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
    rating: 4.0,
    category: "clothing",
  },
  {
    id: "5",
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
    rating: 4.3,
    category: "accessories",
  },
  {
    id: "6",
    name: "Wireless Charging Pad",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1608751819407-8c8734b2c66d?w=500&q=80",
    rating: 4.1,
    category: "electronics",
  },
  {
    id: "7",
    name: "Minimalist Desk Lamp",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
    rating: 4.4,
    category: "furniture",
  },
  {
    id: "8",
    name: "Leather Wallet",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
    rating: 4.6,
    category: "accessories",
  },
];

export default ProductGrid;
