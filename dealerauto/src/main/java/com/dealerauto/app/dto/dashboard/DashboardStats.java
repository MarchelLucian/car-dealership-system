package com.dealerauto.app.dto.dashboard;

import java.util.List;

public class DashboardStats {

    // Overview Stats
    private Double totalSalesRevenue;
    private Integer totalCarsSold;
    private Double totalProfit;
    private Integer carsInStock;
    private Integer carsRetracted;

    private Double totalRetractedCost;
    private Double currentStockValue;
    private Integer totalSalesAgents;
    private Double totalMonthlySalaries;
    private Integer totalCustomers;
    private Integer totalOnlineUsers;

    private Integer totalProviders;
    private Integer companyProviders;
    private Integer individualProviders;


    // Top Agents
    private List<AgentPerformance> topAgents;

    // Brand Stats
    private List<BrandStats> brandStats;

    // Provider Stats
    private List<ProviderStats> providerStats;

    // Monthly Sales (last 12 months)
    private List<MonthlySales> monthlySales;

    // Payment Method Distribution
    private List<PaymentMethodStats> paymentMethodStats;

    // ===== CONSTRUCTORS =====

    public DashboardStats() {
    }

    // ===== GETTERS & SETTERS =====

    public Double getTotalSalesRevenue() {
        return totalSalesRevenue;
    }

    public void setTotalSalesRevenue(Double totalSalesRevenue) {
        this.totalSalesRevenue = totalSalesRevenue;
    }

    public Integer getTotalCarsSold() {
        return totalCarsSold;
    }

    public void setTotalCarsSold(Integer totalCarsSold) {
        this.totalCarsSold = totalCarsSold;
    }

    public Double getTotalProfit() {
        return totalProfit;
    }

    public void setTotalProfit(Double totalProfit) {
        this.totalProfit = totalProfit;
    }

    public Integer getCarsInStock() {
        return carsInStock;
    }

    public void setCarsInStock(Integer carsInStock) {
        this.carsInStock = carsInStock;
    }

    public Integer getCarsRetracted() {
        return carsRetracted;
    }

    public void setCarsRetracted(Integer carsRetracted) {
        this.carsRetracted = carsRetracted;
    }

    public List<AgentPerformance> getTopAgents() {
        return topAgents;
    }

    public void setTopAgents(List<AgentPerformance> topAgents) {
        this.topAgents = topAgents;
    }

    public List<BrandStats> getBrandStats() {
        return brandStats;
    }

    public void setBrandStats(List<BrandStats> brandStats) {
        this.brandStats = brandStats;
    }

    public List<ProviderStats> getProviderStats() {
        return providerStats;
    }

    public void setProviderStats(List<ProviderStats> providerStats) {
        this.providerStats = providerStats;
    }

    public List<MonthlySales> getMonthlySales() {
        return monthlySales;
    }

    public void setMonthlySales(List<MonthlySales> monthlySales) {
        this.monthlySales = monthlySales;
    }

    public List<PaymentMethodStats> getPaymentMethodStats() {
        return paymentMethodStats;
    }

    public void setPaymentMethodStats(List<PaymentMethodStats> paymentMethodStats) {
        this.paymentMethodStats = paymentMethodStats;
    }


    public Double getTotalRetractedCost() {
        return totalRetractedCost;
    }

    public void setTotalRetractedCost(Double totalRetractedCost) {
        this.totalRetractedCost = totalRetractedCost;
    }

    public Double getCurrentStockValue() {
        return currentStockValue;
    }

    public void setCurrentStockValue(Double currentStockValue) {
        this.currentStockValue = currentStockValue;
    }

    public Integer getTotalSalesAgents() {
        return totalSalesAgents;
    }

    public void setTotalSalesAgents(Integer totalSalesAgents) {
        this.totalSalesAgents = totalSalesAgents;
    }

    public Double getTotalMonthlySalaries() {
        return totalMonthlySalaries;
    }

    public void setTotalMonthlySalaries(Double totalMonthlySalaries) {
        this.totalMonthlySalaries = totalMonthlySalaries;
    }

    public Integer getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(Integer totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public Integer getTotalOnlineUsers() {
        return totalOnlineUsers;
    }

    public void setTotalOnlineUsers(Integer totalOnlineUsers) {
        this.totalOnlineUsers = totalOnlineUsers;
    }

    public Integer getTotalProviders() {
        return totalProviders;
    }

    public void setTotalProviders(Integer totalProviders) {
        this.totalProviders = totalProviders;
    }

    public Integer getCompanyProviders() {
        return companyProviders;
    }

    public void setCompanyProviders(Integer companyProviders) {
        this.companyProviders = companyProviders;
    }

    public Integer getIndividualProviders() {
        return individualProviders;
    }

    public void setIndividualProviders(Integer individualProviders) {
        this.individualProviders = individualProviders;
    }

}