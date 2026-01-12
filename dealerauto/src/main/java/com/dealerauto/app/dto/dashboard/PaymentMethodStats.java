package com.dealerauto.app.dto.dashboard;

public class PaymentMethodStats {

    private String paymentMethod; // "Cash", "Transfer bancar", "Leasing", "Rate"
    private Integer salesCount;
    private Double totalRevenue;

    // ===== CONSTRUCTORS =====

    public PaymentMethodStats() {
    }

    public PaymentMethodStats(String paymentMethod, Integer salesCount, Double totalRevenue) {
        this.paymentMethod = paymentMethod;
        this.salesCount = salesCount;
        this.totalRevenue = totalRevenue;
    }

    // ===== GETTERS & SETTERS =====

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
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
}
