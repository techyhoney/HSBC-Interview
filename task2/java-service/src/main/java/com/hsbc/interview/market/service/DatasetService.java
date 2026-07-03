package com.hsbc.interview.market.service;

import com.hsbc.interview.market.model.Property;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Loads and caches housing dataset from CSV.
 */
@Service
public class DatasetService {

    private static final Logger log = LoggerFactory.getLogger(DatasetService.class);

    private List<Property> properties = Collections.emptyList();

    @PostConstruct
    void load() {
        List<Property> parsed = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("housing-price-dataset.csv");
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String line = reader.readLine(); // header
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) {
                    continue;
                }
                String[] parts = line.split(",");
                parsed.add(new Property(
                        Integer.parseInt(parts[0].trim()),
                        Double.parseDouble(parts[1].trim()),
                        Integer.parseInt(parts[2].trim()),
                        Double.parseDouble(parts[3].trim()),
                        Integer.parseInt(parts[4].trim()),
                        Double.parseDouble(parts[5].trim()),
                        Double.parseDouble(parts[6].trim()),
                        Double.parseDouble(parts[7].trim()),
                        Double.parseDouble(parts[8].trim())
                ));
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to load housing dataset CSV", e);
        }
        this.properties = Collections.unmodifiableList(parsed);
        log.info("Loaded {} properties from dataset", properties.size());
    }

    public List<Property> all() {
        return properties;
    }
}
