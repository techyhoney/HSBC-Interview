package com.hsbc.interview.market.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Wires the RestClient pointed at the Task 1 model API and enables CORS
 * so the Next.js portal can call this service from the browser.
 */
@Configuration
public class AppConfig implements WebMvcConfigurer {

    @Value("${model.api.url:http://localhost:8000}")
    private String modelApiUrl;

    @Bean
    public RestClient modelApiClient() {
        return RestClient.builder()
                .baseUrl(modelApiUrl)
                .build();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "OPTIONS");
    }
}
