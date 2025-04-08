package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.elasticsearch.ProductElasticsearchRepository;
import com.ecommerce.repository.mongo.ProductMongoRepository;
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

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.SearchHit;

import java.io.IOException;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductMongoRepository productMongoRepository;
    private final ProductElasticsearchRepository productElasticsearchRepository;
    private final RestHighLevelClient restHighLevelClient;

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
        return productElasticsearchRepository.findByNameOrDescriptionWithFuzzyMatch(query, pageable);
    }

    public Product saveProduct(Product product) {
        if (product.getCreatedAt() == null) {
            product.setCreatedAt(LocalDateTime.now());
        }
        product.setUpdatedAt(LocalDateTime.now());
        
        // Save to MongoDB
        Product savedProduct = productMongoRepository.save(product);
        
        // Index in Elasticsearch only for search functionality
        productElasticsearchRepository.save(savedProduct);
        
        return savedProduct;
    }

    public void deleteProduct(String id) {
        productMongoRepository.deleteById(id);
        // Also remove from Elasticsearch index
        productElasticsearchRepository.deleteById(id);
    }

    // Use MongoDB for price range search instead of Elasticsearch
    public List<Product> searchByPriceRange(double minPrice, double maxPrice) {
        return productMongoRepository.findByPriceRange(BigDecimal.valueOf(minPrice), BigDecimal.valueOf(maxPrice));
    }
}
