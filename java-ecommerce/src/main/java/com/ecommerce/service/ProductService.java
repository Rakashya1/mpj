package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductElasticsearchRepository;
import com.ecommerce.repository.ProductMongoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductMongoRepository productMongoRepository;
    private final ProductElasticsearchRepository productElasticsearchRepository;

    public List<Product> getAllProducts() {
        return productMongoRepository.findAll();
    }

    public Page<Product> getProductsPaginated(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productMongoRepository.findAll(pageable);
    }

    public Optional<Product> getProductById(String id) {
        return productMongoRepository.findById(id);
    }

    public List<Product> getProductsByCategory(String category) {
        return productMongoRepository.findByCategory(category);
    }

    public List<Product> getProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productMongoRepository.findByPriceRange(minPrice, maxPrice);
    }

    public List<Product> getProductsByMinimumRating(Double rating) {
        return productMongoRepository.findByMinimumRating(rating);
    }

    public List<Product> getProductsByFilters(List<String> categories, BigDecimal minPrice, BigDecimal maxPrice, Double rating) {
        return productMongoRepository.findByFilters(categories, minPrice, maxPrice, rating);
    }

    public Page<Product> searchProducts(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productElasticsearchRepository.fuzzySearch(query, pageable);
    }

    public Product saveProduct(Product product) {
        if (product.getCreatedAt() == null) {
            product.setCreatedAt(LocalDateTime.now());
        }
        product.setUpdatedAt(LocalDateTime.now());
        
        // Save to MongoDB first
        Product savedProduct = productMongoRepository.save(product);
        
        // Then save to Elasticsearch
        productElasticsearchRepository.save(savedProduct);
        
        return savedProduct;
    }

    public void deleteProduct(String id) {
        productMongoRepository.deleteById(id);
        productElasticsearchRepository.deleteById(id);
    }
}
