package com.dealerauto.app.dto.dashboard;

public class ProviderStats {

    private String providerName;
    private Integer carsSupplied;
    private Integer carsSold;

    // ===== CONSTRUCTORS =====

    public ProviderStats() {
    }

    public ProviderStats(String providerName, Integer carsSupplied, Integer carsSold) {
        this.providerName = providerName;
        this.carsSupplied = carsSupplied;
        this.carsSold = carsSold;
    }

    // ===== GETTERS & SETTERS =====

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public Integer getCarsSupplied() {
        return carsSupplied;
    }

    public void setCarsSupplied(Integer carsSupplied) {
        this.carsSupplied = carsSupplied;
    }

    public Integer getCarsSold() {
        return carsSold;
    }

    public void setCarsSold(Integer carsSold) {
        this.carsSold = carsSold;
    }
}