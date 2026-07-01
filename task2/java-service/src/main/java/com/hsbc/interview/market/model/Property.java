package com.hsbc.interview.market.model;

/**
 * A single housing dataset row.
 */
public record Property(
        int id,
        double squareFootage,
        int bedrooms,
        double bathrooms,
        int yearBuilt,
        double lotSize,
        double distanceToCityCenter,
        double schoolRating,
        double price
) {
}
