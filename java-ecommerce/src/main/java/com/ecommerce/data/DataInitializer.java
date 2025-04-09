package com.ecommerce.data;

import com.ecommerce.model.Product;
import com.ecommerce.repository.elasticsearch.ProductElasticsearchRepository;
import com.ecommerce.repository.mongo.ProductMongoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    @Profile("dev") // Only run in dev profile
    public CommandLineRunner initData(ProductMongoRepository mongoRepository, 
                                    ProductElasticsearchRepository elasticsearchRepository) {
        return args -> {
            // Clear existing data
            mongoRepository.deleteAll();
            elasticsearchRepository.deleteAll();
            
            // Create sample products
            List<Product> products = Arrays.asList(
                Product.builder()
                    .name("Wireless Bluetooth Headphones")
                    .description("Premium noise-cancelling headphones with 30-hour battery life")
                    .price(129.99)
                    .originalPrice(159.99)
                    .category("Electronics")
                    .image("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80")
                    .rating(4.5)
                    .isNew(true)
                    .createdAt(LocalDateTime.now())
                    .build(),
                    
                Product.builder()
                    .name("Smart Fitness Tracker")
                    .description("Track your workouts, heart rate, and sleep with this waterproof fitness band")
                    .price(89.99)
                    .originalPrice(99.99)
                    .category("Electronics")
                    .image("https://images.unsplash.com/photo-1575311373937-040b8e1fd6b0?w=800&q=80")
                    .rating(4.3)
                    .isNew(true)
                    .createdAt(LocalDateTime.now())
                    .build(),
                    
                Product.builder()
                    .name("Cotton T-Shirt")
                    .description("Comfortable 100% cotton t-shirt in various colors")
                    .price(19.99)
                    .category("Clothing")
                    .image("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80")
                    .rating(4.0)
                    .isNew(false)
                    .createdAt(LocalDateTime.now())
                    .build(),
                    
                Product.builder()
                    .name("Stainless Steel Water Bottle")
                    .description("Vacuum insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours")
                    .price(24.99)
                    .originalPrice(29.99)
                    .category("Home & Kitchen")
                    .image("https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80")
                    .rating(4.7)
                    .isNew(false)
                    .createdAt(LocalDateTime.now())
                    .build(),
                    
                Product.builder()
                    .name("Bestselling Novel")
                    .description("The latest bestselling fiction novel everyone's talking about")
                    .price(14.99)
                    .category("Books")
                    .image("https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80")
                    .rating(4.8)
                    .isNew(true)
                    .createdAt(LocalDateTime.now())
                    .build()
            );
            
            // Save to MongoDB
            mongoRepository.saveAll(products);
            
            // Index in Elasticsearch
            elasticsearchRepository.saveAll(products);
            
            System.out.println("Sample data initialized with " + products.size() + " products");
        };
    }
}
