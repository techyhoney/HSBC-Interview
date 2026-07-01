package com.hsbc.interview.market.service;

import com.hsbc.interview.market.model.WhatIfRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

/**
 * Forwards what-if feature payloads to the Task 1 model API `/predict`.
 */
@Service
public class PredictionService {

    private final RestClient restClient;

    public PredictionService(RestClient modelApiClient) {
        this.restClient = modelApiClient;
    }

    public double predict(WhatIfRequest req) {
        Map<String, Object> feature = Map.of(
                "square_footage", req.squareFootage(),
                "bedrooms", req.bedrooms(),
                "bathrooms", req.bathrooms(),
                "year_built", req.yearBuilt(),
                "lot_size", req.lotSize(),
                "distance_to_city_center", req.distanceToCityCenter(),
                "school_rating", req.schoolRating()
        );
        Map<String, Object> body = Map.of("items", List.of(feature));

        try {
            PredictResponse response = restClient.post()
                    .uri("/predict")
                    .body(body)
                    .retrieve()
                    .body(PredictResponse.class);

            if (response == null || response.predictions() == null || response.predictions().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "Malformed response from model API");
            }
            return response.predictions().get(0);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Model API is unreachable: " + e.getMessage(), e);
        }
    }

    private record PredictResponse(List<Double> predictions) {
    }
}
