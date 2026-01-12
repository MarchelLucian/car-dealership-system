package com.dealerauto.app.dto.dashboard;

public class AgentPerformance {

    private Integer agentId;
    private String agentName;
    private Integer salesCount;
    private Double totalRevenue;
    private Double totalProfit;
    private Double averageMarkup; // Markup mediu în procente

    // ===== CONSTRUCTORS =====
    public AgentPerformance() {
    }

    public AgentPerformance(Integer agentId, String agentName, Integer salesCount,
                            Double totalRevenue, Double totalProfit) {
        this.agentId = agentId;
        this.agentName = agentName;
        this.salesCount = salesCount;
        this.totalRevenue = totalRevenue;
        this.totalProfit = totalProfit;
    }

    // ===== GETTERS & SETTERS =====

    public Integer getAgentId() {
        return agentId;
    }

    public void setAgentId(Integer agentId) {
        this.agentId = agentId;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public Integer getSalesCount() {
        return salesCount;
    }

    public void setSalesCount(Integer salesCount) {
        this.salesCount = salesCount;
    }

    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Double getTotalProfit() {
        return totalProfit;
    }

    public void setTotalProfit(Double totalProfit) {
        this.totalProfit = totalProfit;
    }

    public Double getAverageMarkup() {
        return averageMarkup;
    }

    public void setAverageMarkup(Double averageMarkup) {
        this.averageMarkup = averageMarkup;
    }
}