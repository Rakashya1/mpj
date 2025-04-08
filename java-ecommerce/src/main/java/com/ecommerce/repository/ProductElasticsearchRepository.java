package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.math.BigDecimal;

public interface ProductElasticsearchRepository extends ElasticsearchRepository<Product, String> {

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    @Query("{\"bool\": {\"must\": [{\"match\": {\"name\": \"?0\"}}]}}")
    Page<Product> searchByName(String name, Pageable pageable);
    
    @Query("{\"bool\": {\"must\": [{\"match\": {\"category\": \"?0\"}}]}}")
    Page<Product> searchByCategory(String category, Pageable pageable);
    
    @Query("{\"bool\": {\"must\": [{\"range\": {\"price\": {\"gte\": ?0, \"lte\": ?1}}}]}}")
    Page<Product> searchByPriceRange(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    
    @Query("{\"bool\": {\"must\": [{\"range\": {\"rating\": {\"gte\": ?0}}}]}}")
    Page<Product> searchByMinimumRating(Double rating, Pageable pageable);
    
    @Query("{\"bool\": {\"must\": [{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"name^3\", \"description\"], \"fuzziness\": \"AUTO\"}}]}}")
    Page<Product> fuzzySearch(String query, Pageable pageable);
}
