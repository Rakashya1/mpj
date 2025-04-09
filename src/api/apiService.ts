/**
 * API Service for connecting to the Java backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  description?: string;
  quantity?: number;
  originalPrice?: number;
  isNew?: boolean;
}

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Search products using Elasticsearch
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/products/search?query=${encodeURIComponent(query)}`,
      { credentials: 'include' }
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

// Filter products
export const filterProducts = async (
  categories: string[] = [],
  minPrice: number = 0,
  maxPrice: number = 1000,
  rating: number = 0,
): Promise<Product[]> => {
  try {
    const params = new URLSearchParams();
    if (categories.length) categories.forEach(c => params.append('categories', c));
    params.append('minPrice', minPrice.toString());
    params.append('maxPrice', maxPrice.toString());
    params.append('rating', rating.toString());

    const response = await fetch(
      `${API_BASE_URL}/api/products/filter?${params}`,
      { credentials: 'include' }
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error filtering products:", error);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
};
