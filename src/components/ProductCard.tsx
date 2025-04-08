import React from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
  isNew?: boolean;
  onAddToCart?: (id: string) => void;
  onQuickView?: (id: string) => void;
}

const ProductCard = ({
  id = "1",
  name = "Premium Wireless Headphones",
  price = 129.99,
  originalPrice = 159.99,
  image = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  rating = 4.5,
  category = "Electronics",
  isNew = false,
  onAddToCart = () => {},
  onQuickView = () => {},
}: ProductCardProps) => {
  return (
    <Card className="group relative overflow-hidden rounded-lg border bg-white transition-all hover:shadow-lg">
      {isNew && (
        <Badge className="absolute left-3 top-3 z-10 bg-blue-500 text-white">
          New
        </Badge>
      )}
      {originalPrice && originalPrice > price && (
        <Badge className="absolute right-3 top-3 z-10 bg-red-500 text-white">
          Sale
        </Badge>
      )}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onQuickView(id)}
            >
              Quick View
            </Button>
            <Button variant="default" size="sm" onClick={() => onAddToCart(id)}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-1 text-sm text-muted-foreground">{category}</div>
        <h3 className="mb-2 line-clamp-2 text-base font-medium">{name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
            </div>
            <span className="text-xs text-muted-foreground">{rating}</span>
          </div>
          <div className="flex items-center gap-2">
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-medium text-primary">
              ${price.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
