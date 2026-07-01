package com.hsbc.interview.market.model;

/**
 * Hypothetical property inputs for the what-if tool.
 */
public record WhatIfRequest(
        double squareFootage,
        int bedrooms,
        double bathrooms,
        int yearBuilt,
        double lotSize,
        double distanceToCityCenter,
        double schoolRating
) {
}
