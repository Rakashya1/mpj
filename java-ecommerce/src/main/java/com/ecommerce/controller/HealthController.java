package com.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private ElasticsearchOperations elasticsearchOperations;

    @GetMapping("/mongo")
    public ResponseEntity<String> checkMongoConnection() {
        try {
            // Try to ping MongoDB
            mongoTemplate.getDb().runCommand(new org.bson.Document("ping", 1));
            return ResponseEntity.ok("MongoDB connection successful");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("MongoDB connection failed: " + e.getMessage());
        }
    }

    @GetMapping("/elasticsearch")
    public ResponseEntity<String> checkElasticsearchConnection() {
        try {
            // Try to ping Elasticsearch
            boolean isConnected = elasticsearchOperations.ping();
            if (isConnected) {
                return ResponseEntity.ok("Elasticsearch connection successful");
            } else {
                return ResponseEntity.status(500).body("Elasticsearch connection failed");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Elasticsearch connection failed: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<String> checkHealth() {
        try {
            // Check both connections
            mongoTemplate.getDb().runCommand(new org.bson.Document("ping", 1));
            boolean esConnected = elasticsearchOperations.ping();
            
            if (esConnected) {
                return ResponseEntity.ok("All services are healthy");
            } else {
                return ResponseEntity.status(500).body("Elasticsearch connection failed");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Health check failed: " + e.getMessage());
        }
    }
}
