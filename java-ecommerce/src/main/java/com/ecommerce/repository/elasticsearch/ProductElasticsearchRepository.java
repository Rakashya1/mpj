package com.ecommerce.repository.elasticsearch;

import com.ecommerce.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ProductElasticsearchRepository extends ElasticsearchRepository<Product, String> {
    
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    @Query("{\"bool\": {\"must\": [{\"match\": {\"name\": \"?0\"}}]}}")
    Page<Product> searchByName(String name, Pageable pageable);
    
    @Query("{\"bool\": {\"must\": [{\"match\": {\"category\": \"?0\"}}]}}")
    Page<Product> searchByCategory(String category, Pageable pageable);
    
    @Query("{" +
           "  \"function_score\": {" +
           "    \"query\": {" +
           "      \"bool\": {" +
           "        \"should\": [" +
           "          {\"match\": {\"name\": {\"query\": \"?0\", \"boost\": 3.0, \"fuzziness\": \"AUTO\"}}}," +
           "          {\"match\": {\"description\": {\"query\": \"?0\", \"fuzziness\": \"AUTO\"}}}" +
           "        ]" +
           "      }" +
           "    }" +
           "  }" +
           "}")
    Page<Product> findByNameOrDescriptionWithFuzzyMatch(String searchTerm, Pageable pageable);
}