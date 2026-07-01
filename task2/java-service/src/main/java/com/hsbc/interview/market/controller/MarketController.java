package com.hsbc.interview.market.controller;

import com.hsbc.interview.market.model.MarketStats;
import com.hsbc.interview.market.model.Property;
import com.hsbc.interview.market.model.SegmentStat;
import com.hsbc.interview.market.model.WhatIfRequest;
import com.hsbc.interview.market.model.WhatIfResponse;
import com.hsbc.interview.market.service.MarketService;
import com.hsbc.interview.market.service.PredictionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * REST endpoints for the Property Market Analysis dashboard (App 2).
 */
@RestController
@RequestMapping("/api")
public class MarketController {

    private final MarketService marketService;
    private final PredictionService predictionService;

    public MarketController(MarketService marketService, PredictionService predictionService) {
        this.marketService = marketService;
        this.predictionService = predictionService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @GetMapping("/market/stats")
    public MarketStats stats() {
        return marketService.overallStats();
    }

    @GetMapping("/market/segments")
    public List<SegmentStat> segments(
            @RequestParam(defaultValue = "bedrooms") String groupBy,
            @RequestParam(required = false) Integer minBedrooms,
            @RequestParam(required = false) Integer maxBedrooms,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear,
            @RequestParam(required = false) Double minSchoolRating) {
        return marketService.segments(groupBy, minBedrooms, maxBedrooms, minYear, maxYear, minSchoolRating);
    }

    @GetMapping("/properties")
    public List<Property> properties(
            @RequestParam(required = false) Integer minBedrooms,
            @RequestParam(required = false) Integer maxBedrooms,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear,
            @RequestParam(required = false) Double minSchoolRating,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {
        return marketService.properties(minBedrooms, maxBedrooms, minYear, maxYear,
                minSchoolRating, sortBy, order);
    }

    @PostMapping("/whatif")
    public WhatIfResponse whatIf(@RequestBody WhatIfRequest request) {
        double predicted = predictionService.predict(request);
        double avg = marketService.datasetAvgPrice();
        return new WhatIfResponse(
                Math.round(predicted * 100.0) / 100.0,
                avg,
                Math.round((predicted - avg) * 100.0) / 100.0
        );
    }
}
