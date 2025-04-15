package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public String getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "DESC") String direction,
            Model model) {
        
        Page<Product> productPage = productService.getProductsPaginated(page, size, sort, direction);
        
        model.addAttribute("products", productPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productPage.getTotalPages());
        model.addAttribute("totalItems", productPage.getTotalElements());
        model.addAttribute("sortField", sort);
        model.addAttribute("sortDirection", direction);
        
        return "product/list";
    }

    @GetMapping("/search")
    public String searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Model model) {
        
        Page<Product> productPage = productService.searchProducts(query, page, size);
        
        model.addAttribute("products", productPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", productPage.getTotalPages());
        model.addAttribute("totalItems", productPage.getTotalElements());
        model.addAttribute("searchQuery", query);
        
        return "product/list"; // Changed from search-results to list
    }

    @GetMapping("/{id}")
    public String getProductDetails(@PathVariable String id, Model model) {
        Product product = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        model.addAttribute("product", product);
        
        return "product/details";
    }

    @GetMapping("/filter")
    public String filterProducts(
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false, defaultValue = "0") BigDecimal minPrice,
            @RequestParam(required = false, defaultValue = "10000") BigDecimal maxPrice,defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "0") Double rating,    @RequestParam(defaultValue = "12") int size,
            Model model) {
            @RequestParam(defaultValue = "DESC") String direction,
        List<Product> filteredProducts = productService.getProductsByFilters(categories, minPrice, maxPrice, rating);
        
        model.addAttribute("products", filteredProducts);
        model.addAttribute("categories", categories);ries={}, minPrice={}, maxPrice={}, rating={}", 
        model.addAttribute("minPrice", minPrice);e, rating);
        model.addAttribute("maxPrice", maxPrice);
        model.addAttribute("rating", rating);List<Product> filteredProducts;
        model.addAttribute("totalItems", filteredProducts.size());
           // If no filters are applied, return all products paginated
        return "product/list";       if ((categories == null || categories.isEmpty()) && 
    }            minPrice.compareTo(BigDecimal.ZERO) == 0 && 


}            maxPrice.compareTo(new BigDecimal("10000")) == 0 && 
            rating == 0) {
            
            Page<Product> productPage = productService.getProductsPaginated(page, size, sort, direction);
            filteredProducts = productPage.getContent();
            model.addAttribute("totalPages", productPage.getTotalPages());
            model.addAttribute("totalItems", productPage.getTotalElements());
        } else {
            filteredProducts = productService.getProductsByFilters(categories, minPrice, maxPrice, rating);
        }
        
        // Log results
        log.info("Found {} products after filtering", filteredProducts.size());
        
        model.addAttribute("products", filteredProducts);
        model.addAttribute("categories", categories);
        model.addAttribute("minPrice", minPrice);
        model.addAttribute("maxPrice", maxPrice);
        model.addAttribute("rating", rating);
        model.addAttribute("currentPage", page);
        model.addAttribute("sortField", sort);
        model.addAttribute("sortDirection", direction);
        model.addAttribute("totalItems", filteredProducts.size());
        
        return "product/list";
    }
}
