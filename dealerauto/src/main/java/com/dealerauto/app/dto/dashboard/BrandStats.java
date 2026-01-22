package com.dealerauto.app.dto.dashboard;

public class BrandStats {

    private String brand;
    private Integer carsSold;
    private Double avgPrice;
    private Double totalRevenue;
    private Integer carsInStock;

    private Double totalProfit;
    private Double stockValue;
    // ===== CONSTRUCTORS =====

    public BrandStats() {
    }

    public BrandStats(String brand, Integer carsSold, Double avgPrice, Double totalRevenue) {
        this.brand = brand;
        this.carsSold = carsSold;
        this.avgPrice = avgPrice;
        this.totalRevenue = totalRevenue;
    }

    public BrandStats(String brand, Integer carsSold, Double avgPrice, Double totalRevenue, Integer carsInStock ) {
        this.brand = brand;
        this.carsSold = carsSold;
        this.avgPrice = avgPrice;
        this.totalRevenue = totalRevenue;
        this.carsInStock=carsInStock;
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

    public Integer getCarsInStock() {
        return carsInStock;
    }

    public void setCarsInStock(Integer carsInStock) {
        this.carsInStock = carsInStock;
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

    // Getters & Setters
    public Double getTotalProfit() {
        return totalProfit;
    }

    public void setTotalProfit(Double totalProfit) {
        this.totalProfit = totalProfit;
    }

    public Double getStockValue() {
        return stockValue;
    }

    public void setStockValue(Double stockValue) {
        this.stockValue = stockValue;
    }
}