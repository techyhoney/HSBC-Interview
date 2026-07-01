package com.hsbc.interview.market.model;

/**
 * Predicted price for a what-if scenario, plus dataset context.
 */
public record WhatIfResponse(
        double predictedPrice,
        double datasetAvgPrice,
        double differenceFromAvg
) {
}
