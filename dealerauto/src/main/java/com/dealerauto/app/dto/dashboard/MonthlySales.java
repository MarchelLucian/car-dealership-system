package com.dealerauto.app.dto.dashboard;

public class MonthlySales {

    private String month; // Format: "2025-01" sau "January 2025"
    private Integer salesCount;
    private Double revenue;
    private Double profit;

    // ===== CONSTRUCTORS =====

    public MonthlySales() {
    }

    public MonthlySales(String month, Integer salesCount, Double revenue, Double profit) {
        this.month = month;
        this.salesCount = salesCount;
        this.revenue = revenue;
        this.profit = profit;
    }

    // ===== GETTERS & SETTERS =====

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Integer getSalesCount() {
        return salesCount;
    }

    public void setSalesCount(Integer salesCount) {
        this.salesCount = salesCount;
    }

    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }

    public Double getProfit() {
        return profit;
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }
}