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

@Configuration
public class AdditionalProductsInitializer {

    @Bean
    @Profile("dev")
    public CommandLineRunner initMoreProducts(ProductMongoRepository mongoRepository,
                                            ProductElasticsearchRepository elasticsearchRepository) {
        return args -> {
            var products = Arrays.asList(
                Product.builder()
                    .name("Premium Coffee Maker")
                    .description("12-cup programmable coffee maker with auto-shutoff")
                    .price(79.99)
                    .category("Home & Kitchen")
                    .image("https://images.unsplash.com/photo-1544552866-d3ed42536d26?w=800&q=80")
                    .rating(4.6)
                    .isNew(true)
                    .createdAt(LocalDateTime.now())
                    .build(),
                Product.builder()
                    .name("Yoga Mat")
                    .description("Non-slip exercise yoga mat with carrying strap")
                    .price(29.99)
                    .category("Sports")
                    .image("https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&q=80")
                    .rating(4.7)
                    .isNew(false)
                    .createdAt(LocalDateTime.now())
                    .build(),
                Product.builder()
                    .name("Robot Vacuum Cleaner")
                    .description("Smart robot vacuum with mapping technology")
                    .price(299.99)
                    .category("Home & Kitchen")
                    .image("https://images.unsplash.com/photo-1563877120741-be2c316a3f8e?w=800&q=80")
                    .rating(4.4)
                    .isNew(true)
                    .createdAt(LocalDateTime.now())
                    .build(),
                // Add 12 more products with similar pattern...
                Product.builder()
                    .name("Gaming Mouse")
                    .description("RGB gaming mouse with 6 programmable buttons")
                    .price(49.99)
                    .category("Electronics")
                    .image("https://images.unsplash.com/photo-1618477371303-b2a56f422d9e?w=800&q=80")
                    .rating(4.5)
                    .isNew(true)
                    .createdAt(LocalDateTime.now())
                    .build()
            );
            
            // Save to MongoDB
            mongoRepository.saveAll(products);
            
            // Index in Elasticsearch
            elasticsearchRepository.saveAll(products);
            
            System.out.println("Added " + products.size() + " more products");
        };
    }
}
