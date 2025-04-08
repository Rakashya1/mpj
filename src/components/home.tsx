import React, { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ProductGrid from "./ProductGrid";
import FilterSidebar from "./FilterSidebar";
import CartPreview from "./CartPreview";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    priceRange: { min: 0, max: 1000 },
    rating: 0,
  });
  const [sortOption, setSortOption] = useState("newest");

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      rating: 4.5,
      category: "Electronics",
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 199.99,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
      rating: 4.2,
      category: "Electronics",
    },
    {
      id: "3",
      name: "Running Shoes",
      price: 89.99,
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
      rating: 4.7,
      category: "Fashion",
    },
    {
      id: "4",
      name: "Coffee Maker",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&q=80",
      rating: 4.0,
      category: "Home",
    },
    {
      id: "5",
      name: "Backpack",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
      rating: 4.3,
      category: "Fashion",
    },
    {
      id: "6",
      name: "Desk Lamp",
      price: 29.99,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
      rating: 3.8,
      category: "Home",
    },
    {
      id: "7",
      name: "Bluetooth Speaker",
      price: 79.99,
      image:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
      rating: 4.6,
      category: "Electronics",
    },
    {
      id: "8",
      name: "Yoga Mat",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?w=500&q=80",
      rating: 4.1,
      category: "Sports",
    },
  ];

  // Filter products based on search query and active filters
  const filteredProducts = mockProducts.filter((product) => {
    // Search filter
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (
      activeFilters.categories.length > 0 &&
      !activeFilters.categories.includes(product.category)
    ) {
      return false;
    }

    // Price range filter
    if (
      product.price < activeFilters.priceRange.min ||
      product.price > activeFilters.priceRange.max
    ) {
      return false;
    }

    // Rating filter
    if (activeFilters.rating > 0 && product.rating < activeFilters.rating) {
      return false;
    }

    return true;
  });

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "priceHighToLow":
        return b.price - a.price;
      case "priceLowToHigh":
        return a.price - b.price;
      case "popularity":
        return b.rating - a.rating;
      case "newest":
      default:
        return parseInt(b.id) - parseInt(a.id);
    }
  });

  const handleAddToCart = (product: Product) => {
    // Check if product already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id,
    );

    if (existingItemIndex >= 0) {
      // If product exists, update quantity
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      // If product doesn't exist, add it with quantity 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }

    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCart);
  };

  const handleFilterChange = (filters: typeof activeFilters) => {
    setActiveFilters(filters);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary mr-8">ShopNow</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-sm font-medium hover:text-primary">
                Home
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary">
                Categories
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary">
                New Arrivals
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary">
                Deals
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative w-64 hidden md:block">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8"
              />
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Search - visible only on small screens */}
      <div className="md:hidden container mx-auto px-4 py-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8 w-full"
          />
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <FilterSidebar
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              categories={Array.from(
                new Set(mockProducts.map((p) => p.category)),
              )}
            />
          </aside>

          {/* Product Grid Section */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Products ({sortedProducts.length})
              </h2>
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground mr-2">
                  Sort by:
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="text-sm border rounded-md p-1"
                >
                  <option value="newest">Newest</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>

            <ProductGrid
              products={sortedProducts}
              onAddToCart={handleAddToCart}
              filters={{
                categories: activeFilters.categories,
                priceRange: [
                  activeFilters.priceRange.min,
                  activeFilters.priceRange.max,
                ],
                minRating: activeFilters.rating,
              }}
              sortOption={
                sortOption === "priceHighToLow"
                  ? "price-high-low"
                  : sortOption === "priceLowToHigh"
                    ? "price-low-high"
                    : sortOption === "popularity"
                      ? "popularity"
                      : "newest"
              }
            />
          </div>
        </div>
      </main>

      {/* Cart Preview */}
      <CartPreview
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
      />
    </div>
  );
};

export default HomePage;
