package com.dealerauto.app.dto.dashboard;

public class BrandStats {

    private String brand;
    private Integer carsSold;
    private Double avgPrice;
    private Double totalRevenue;

    // ===== CONSTRUCTORS =====

    public BrandStats() {
    }

    public BrandStats(String brand, Integer carsSold, Double avgPrice, Double totalRevenue) {
        this.brand = brand;
        this.carsSold = carsSold;
        this.avgPrice = avgPrice;
        this.totalRevenue = totalRevenue;
    }

    // ===== GETTERS & SETTERS =====

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Integer getCarsSold() {
        return carsSold;
    }

    public void setCarsSold(Integer carsSold) {
        this.carsSold = carsSold;
    }

    public Double getAvgPrice() {
        return avgPrice;
    }

    public void setAvgPrice(Double avgPrice) {
        this.avgPrice = avgPrice;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}