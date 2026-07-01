package com.hsbc.interview.market.model;

/**
 * Aggregate for one segment (e.g. all 3-bedroom homes).
 */
public record SegmentStat(
        String segment,
        long count,
        double avgPrice,
        double minPrice,
        double maxPrice
) {
}
