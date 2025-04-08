package com.ecommerce.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.core.convert.ElasticsearchConverter;
import org.springframework.data.elasticsearch.core.convert.MappingElasticsearchConverter;
import org.springframework.data.elasticsearch.core.mapping.SimpleElasticsearchMappingContext;
import co.elastic.clients.transport.ElasticsearchTransport;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.apache.http.HttpHost;

@Configuration
public class ElasticsearchConfig extends ElasticsearchConfiguration {

    @Value("${spring.elasticsearch.uris}")
    private String elasticsearchUrl;

    @Override
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo(elasticsearchUrl.replace("http://", ""))
                .withConnectTimeout(5000)
                .withSocketTimeout(3000)
                .build();
    }

    @Bean
    public RestHighLevelClient restHighLevelClient() {
        return new RestHighLevelClient(
            RestClient.builder(HttpHost.create(elasticsearchUrl))
        );
    }

    @Bean
    public ElasticsearchConverter elasticsearchConverter() {
        return new MappingElasticsearchConverter(elasticsearchMappingContext());
    }

    @Bean
    public SimpleElasticsearchMappingContext elasticsearchMappingContext() {
        return new SimpleElasticsearchMappingContext();
    }
}