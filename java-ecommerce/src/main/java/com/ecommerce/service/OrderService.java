package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.repository.mongo.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    public List<Order> getAllOrders(String status, String sort) {
        if (status != null && !status.isEmpty()) {
            return orderRepository.findByStatus(status);
        }
        
        if (sort != null) {
            String[] parts = sort.split(",");
            String field = parts[0];
            Sort.Direction direction = parts.length > 1 && parts[1].equalsIgnoreCase("asc") ? 
                Sort.Direction.ASC : Sort.Direction.DESC;
            return orderRepository.findAll(Sort.by(direction, field));
        }
        
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }
}
