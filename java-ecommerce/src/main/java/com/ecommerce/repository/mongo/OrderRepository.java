package com.ecommerce.repository.mongo;

import com.ecommerce.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findAllByOrderByCreatedAtDesc();
    
    @Query("{ 'status' : ?0 }")
    List<Order> findByStatus(String status);
}
