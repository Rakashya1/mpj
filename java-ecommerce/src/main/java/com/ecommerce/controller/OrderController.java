package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public String listOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sort,
            Model model) {
        List<Order> orders = orderService.getAllOrders(status, sort);
        model.addAttribute("orders", orders);
        return "order/list";
    }
}
