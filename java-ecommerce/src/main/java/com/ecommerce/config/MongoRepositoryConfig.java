package com.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.ecommerce.repository.mongo")
public class MongoRepositoryConfig {
}
