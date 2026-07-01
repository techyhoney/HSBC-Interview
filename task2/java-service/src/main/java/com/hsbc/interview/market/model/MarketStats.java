package com.hsbc.interview.market.model;

import java.util.List;

/**
 * Aggregate market statistics for the whole dataset (or a filtered subset).
 */
public record MarketStats(
        long count,
        double avgPrice,
        double minPrice,
        double maxPrice,
        double medianPrice,
        double avgSquareFootage,
        double avgPricePerSqft,
        List<SegmentStat> priceByBedrooms
) {
}
