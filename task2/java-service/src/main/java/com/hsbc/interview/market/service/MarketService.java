package com.hsbc.interview.market.service;

import com.hsbc.interview.market.model.MarketStats;
import com.hsbc.interview.market.model.Property;
import com.hsbc.interview.market.model.SegmentStat;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * Computes aggregate market statistics from the in-memory dataset.
 * Results are cached (Caffeine) since the dataset is static at runtime.
 */
@Service
public class MarketService {

    private final DatasetService dataset;

    public MarketService(DatasetService dataset) {
        this.dataset = dataset;
    }

    @Cacheable("marketStats")
    public MarketStats overallStats() {
        return statsFor(dataset.all());
    }

    /**
     * Segmented aggregates grouped by a chosen dimension, with optional filters.
     */
    @Cacheable("segments")
    public List<SegmentStat> segments(String groupBy, Integer minBedrooms, Integer maxBedrooms,
                                      Integer minYear, Integer maxYear, Double minSchoolRating) {
        List<Property> filtered = filter(minBedrooms, maxBedrooms, minYear, maxYear, minSchoolRating);
        Map<String, List<Property>> grouped = filtered.stream()
                .collect(Collectors.groupingBy(p -> segmentKey(groupBy, p)));

        return new TreeMap<>(grouped).entrySet().stream()
                .map(e -> {
                    List<Property> rows = e.getValue();
                    return new SegmentStat(
                            e.getKey(),
                            rows.size(),
                            round(rows.stream().mapToDouble(Property::price).average().orElse(0)),
                            round(rows.stream().mapToDouble(Property::price).min().orElse(0)),
                            round(rows.stream().mapToDouble(Property::price).max().orElse(0))
                    );
                })
                .collect(Collectors.toList());
    }

    /**
     * Dataset rows for the responsive data table, with basic filter + sort.
     */
    public List<Property> properties(Integer minBedrooms, Integer maxBedrooms,
                                     Integer minYear, Integer maxYear, Double minSchoolRating,
                                     String sortBy, String order) {
        List<Property> rows = filter(minBedrooms, maxBedrooms, minYear, maxYear, minSchoolRating);
        Comparator<Property> comparator = comparatorFor(sortBy);
        if ("desc".equalsIgnoreCase(order)) {
            comparator = comparator.reversed();
        }
        return rows.stream().sorted(comparator).collect(Collectors.toList());
    }

    public double datasetAvgPrice() {
        return round(dataset.all().stream().mapToDouble(Property::price).average().orElse(0));
    }

    private MarketStats statsFor(List<Property> rows) {
        double avgPrice = rows.stream().mapToDouble(Property::price).average().orElse(0);
        double avgSqft = rows.stream().mapToDouble(Property::squareFootage).average().orElse(0);
        double avgPpsf = rows.stream()
                .filter(p -> p.squareFootage() > 0)
                .mapToDouble(p -> p.price() / p.squareFootage())
                .average().orElse(0);

        List<Double> sortedPrices = rows.stream()
                .map(Property::price).sorted().collect(Collectors.toList());
        double median = sortedPrices.isEmpty() ? 0 : sortedPrices.get(sortedPrices.size() / 2);

        List<SegmentStat> byBed = new TreeMap<>(rows.stream()
                .collect(Collectors.groupingBy(p -> String.valueOf(p.bedrooms()))))
                .entrySet().stream()
                .map(e -> new SegmentStat(
                        e.getKey() + " bed",
                        e.getValue().size(),
                        round(e.getValue().stream().mapToDouble(Property::price).average().orElse(0)),
                        round(e.getValue().stream().mapToDouble(Property::price).min().orElse(0)),
                        round(e.getValue().stream().mapToDouble(Property::price).max().orElse(0))))
                .collect(Collectors.toList());

        return new MarketStats(
                rows.size(),
                round(avgPrice),
                round(rows.stream().mapToDouble(Property::price).min().orElse(0)),
                round(rows.stream().mapToDouble(Property::price).max().orElse(0)),
                round(median),
                round(avgSqft),
                round(avgPpsf),
                byBed
        );
    }

    private List<Property> filter(Integer minBedrooms, Integer maxBedrooms,
                                  Integer minYear, Integer maxYear, Double minSchoolRating) {
        return dataset.all().stream()
                .filter(p -> minBedrooms == null || p.bedrooms() >= minBedrooms)
                .filter(p -> maxBedrooms == null || p.bedrooms() <= maxBedrooms)
                .filter(p -> minYear == null || p.yearBuilt() >= minYear)
                .filter(p -> maxYear == null || p.yearBuilt() <= maxYear)
                .filter(p -> minSchoolRating == null || p.schoolRating() >= minSchoolRating)
                .collect(Collectors.toList());
    }

    private String segmentKey(String groupBy, Property p) {
        if (groupBy == null) {
            groupBy = "bedrooms";
        }
        return switch (groupBy) {
            case "yearBuilt" -> (p.yearBuilt() / 10 * 10) + "s";
            case "schoolRating" -> "Rating " + (int) Math.floor(p.schoolRating());
            default -> p.bedrooms() + " bed";
        };
    }

    private Comparator<Property> comparatorFor(String sortBy) {
        if (sortBy == null) {
            sortBy = "price";
        }
        return switch (sortBy) {
            case "squareFootage" -> Comparator.comparingDouble(Property::squareFootage);
            case "bedrooms" -> Comparator.comparingInt(Property::bedrooms);
            case "yearBuilt" -> Comparator.comparingInt(Property::yearBuilt);
            case "schoolRating" -> Comparator.comparingDouble(Property::schoolRating);
            default -> Comparator.comparingDouble(Property::price);
        };
    }

    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
