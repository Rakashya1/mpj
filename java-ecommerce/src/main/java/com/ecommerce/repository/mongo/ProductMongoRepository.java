package com.ecommerce.repository.mongo;

import com.ecommerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ProductMongoRepository extends MongoRepository<Product, String> {

    List<Product> findByCategory(String category);
    
    Page<Product> findByCategory(String category, Pageable pageable);
    
    @Query("{price: {$gte: ?0, $lte: ?1}}")
    List<Product> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    
    @Query("{rating: {$gte: ?0}}")
    List<Product> findByMinimumRating(Double rating);
    
    @Query("{$and: [{category: {$in: ?0}}, {price: {$gte: ?1, $lte: ?2}}, {rating: {$gte: ?3}}]}")
    List<Product> findByFilters(List<String> categories, BigDecimal minPrice, BigDecimal maxPrice, Double rating);
}
