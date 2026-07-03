package com.hsbc.interview.market.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.net.http.HttpClient;

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
        // Pin to HTTP/1.1: the JDK HttpClient defaults to HTTP/2 and sends an
        // "Upgrade: h2c" header, which makes uvicorn (the model API server) drop
        // the request body and return 422 for POST /predict.
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();
        return RestClient.builder()
                .baseUrl(modelApiUrl)
                .requestFactory(new JdkClientHttpRequestFactory(httpClient))
                .build();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "OPTIONS");
    }
}
