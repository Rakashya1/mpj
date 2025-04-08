package com.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.Setting;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "products")
@Setting(settingPath = "elasticsearch-settings.json")
public class Product {

    @Id
    private String id;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;
    
    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;
    
    @Field(type = FieldType.Double)
    private BigDecimal price;
    
    @Field(type = FieldType.Double)
    private BigDecimal originalPrice;
    
    @Field(type = FieldType.Text, analyzer = "keyword")
    private String category;
    
    @Field(type = FieldType.Text)
    private String image;
    
    @Field(type = FieldType.Double)
    private Double rating;
    
    @Field(type = FieldType.Boolean)
    private Boolean isNew;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
