package com.dealerauto.app.dto;

import java.sql.Date;
import java.time.LocalDate;


public class SaleViewDTO {

    private Integer saleId;

    // CAR
    private Integer masinaId;
    private String carName;      // ex: Mercedes-Benz C220d
    private String vin;

    // CLIENT
    private Integer clientId;
    private String clientName;   // PF: Prenume Nume | Firmă: Nume
    private String clientType;

    // SALE
    private Date saleDate;
    private Double finalPrice;
    private Double profit;
    private String paymentType;
    private String status;

    private LocalDate dataIntrareStoc;

    // ===== GETTERS =====
    public Integer getSaleId() { return saleId; }
    public Integer getMasinaId() { return masinaId; }
    public String getCarName() { return carName; }
    public String getVin() { return vin; }

    public Integer getClientId() { return clientId; }
    public String getClientName() { return clientName; }
    public String getClientType() { return clientType; }

    public Date getSaleDate() { return saleDate; }
    public Double getFinalPrice() { return finalPrice; }
    public Double getProfit() { return profit; }
    public String getPaymentType() { return paymentType; }

    public String getStatus() {
        return status;
    }

    public LocalDate getDataIntrareStoc() {
        return dataIntrareStoc;
    }

    // ===== SETTERS =====
    public void setSaleId(Integer saleId) { this.saleId = saleId; }
    public void setMasinaId(Integer masinaId) { this.masinaId = masinaId; }
    public void setCarName(String carName) { this.carName = carName; }
    public void setVin(String vin) { this.vin = vin; }

    public void setClientId(Integer clientId) { this.clientId = clientId; }
    public void setClientName(String clientName) { this.clientName = clientName; }
    public void setClientType(String clientType) { this.clientType = clientType; }

    public void setSaleDate(Date saleDate) { this.saleDate = saleDate; }

    public void setDataIntrareStoc(LocalDate dataIntrareStoc) {
        this.dataIntrareStoc = dataIntrareStoc;
    }

    public void setFinalPrice(Double finalPrice) { this.finalPrice = finalPrice; }
    public void setProfit(Double profit) { this.profit = profit; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
    public void setStatus(String status) {
        this.status = status;
    }
}
