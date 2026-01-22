package com.dealerauto.app.model;

import java.time.LocalDate;

public class SaleDetail {

    // Fields
    private Integer saleId;
    private LocalDate saleDate;
    private Double finalPrice;
    private Double profit;
    private String transactionType;
    private String brandName;
    private String model;
    private Double purchasePrice;
    private Integer daysInStock;
    private String clientName;
    private String clientCnp;
    private String agentName;
    private String providerName;
    private Double markupPercentage;

    // ===== CONSTRUCTORS =====

    // Constructor gol (necesar pentru RowMapper)
    public SaleDetail() {
    }

    // Constructor complet
    public SaleDetail(Integer saleId, LocalDate saleDate, Double finalPrice, Double profit,
                      String transactionType, String brandName, String model, Double purchasePrice,
                      Integer daysInStock, String clientName, String clientCnp, String agentName,
                      String providerName, Double markupPercentage) {
        this.saleId = saleId;
        this.saleDate = saleDate;
        this.finalPrice = finalPrice;
        this.profit = profit;
        this.transactionType = transactionType;
        this.brandName = brandName;
        this.model = model;
        this.purchasePrice = purchasePrice;
        this.daysInStock = daysInStock;
        this.clientName = clientName;
        this.clientCnp = clientCnp;
        this.agentName = agentName;
        this.providerName = providerName;
        this.markupPercentage = markupPercentage;
    }

    // Constructor pentru date esențiale
    public SaleDetail(Integer saleId, LocalDate saleDate, Double finalPrice, Double profit,
                      String brandName, String model, String clientName, String agentName) {
        this.saleId = saleId;
        this.saleDate = saleDate;
        this.finalPrice = finalPrice;
        this.profit = profit;
        this.brandName = brandName;
        this.model = model;
        this.clientName = clientName;
        this.agentName = agentName;
    }

    // ===== GETTERS & SETTERS =====

    public Integer getSaleId() {
        return saleId;
    }

    public void setSaleId(Integer saleId) {
        this.saleId = saleId;
    }

    public LocalDate getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDate saleDate) {
        this.saleDate = saleDate;
    }

    public Double getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(Double finalPrice) {
        this.finalPrice = finalPrice;
    }

    public Double getProfit() {
        return profit;
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getBrandName() {
        return brandName;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Double getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(Double purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public Integer getDaysInStock() {
        return daysInStock;
    }

    public void setDaysInStock(Integer daysInStock) {
        this.daysInStock = daysInStock;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getClientCnp() {
        return clientCnp;
    }

    public void setClientCnp(String clientCnp) {
        this.clientCnp = clientCnp;
    }

    public String getAgentName() {
        return agentName;
    }

    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public Double getMarkupPercentage() {
        return markupPercentage;
    }

    public void setMarkupPercentage(Double markupPercentage) {
        this.markupPercentage = markupPercentage;
    }

    // ===== UTILITY METHODS =====

    @Override
    public String toString() {
        return "SaleDetail{" +
                "saleId=" + saleId +
                ", saleDate=" + saleDate +
                ", finalPrice=" + finalPrice +
                ", profit=" + profit +
                ", transactionType='" + transactionType + '\'' +
                ", brandName='" + brandName + '\'' +
                ", model='" + model + '\'' +
                ", purchasePrice=" + purchasePrice +
                ", daysInStock=" + daysInStock +
                ", clientName='" + clientName + '\'' +
                ", clientCnp='" + clientCnp + '\'' +
                ", agentName='" + agentName + '\'' +
                ", providerName='" + providerName + '\'' +
                ", markupPercentage=" + markupPercentage +
                '}';
    }
}