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
import org.springframework.data.elasticsearch.annotations.Mapping;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products") // MongoDB annotation
@org.springframework.data.elasticsearch.annotations.Document(indexName = "products") // Elasticsearch annotation
@Setting(settingPath = "elasticsearch/settings.json") // Elasticsearch settings
@Mapping(mappingPath = "elasticsearch/mappings.json") // Elasticsearch mappings
public class Product {

    @Id
    @Field(type = FieldType.Keyword)
    private String id;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @Field(type = FieldType.Double)
    private Double price;

    @Field(type = FieldType.Double)
    private double originalPrice;

    @Field(type = FieldType.Keyword)
    private String category;

    @Field(type = FieldType.Keyword)
    private String image;

    @Field(type = FieldType.Double)
    private Double rating;

    @Field(type = FieldType.Boolean)
    private Boolean isNew;

    @Builder.Default
    @Field(type = FieldType.Boolean)
    private Boolean deleted = false;

    @Field(type = FieldType.Date)
    private LocalDateTime deletedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
