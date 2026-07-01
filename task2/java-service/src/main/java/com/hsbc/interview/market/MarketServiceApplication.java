package com.hsbc.interview.market;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * App 2 backend: serves aggregate market statistics from the housing dataset
 * and forwards what-if scenarios to the Task 1 model API.
 */
@SpringBootApplication
@EnableCaching
public class MarketServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketServiceApplication.class, args);
    }
}
