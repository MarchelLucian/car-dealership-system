package com.dealerauto.app.model;

import java.sql.Date;

public class Vanzare {

    private Integer id;
    private Integer masinaId;
    private Integer clientId;
    private Integer agentId;

    private Date dataVanzare;
    private Double pretFinal;
    private String tipTranzactie;

    private Double pretAchizitieMasina;
    private Double profit;

    // ========================
    // CONSTRUCTORI
    // ========================

    public Vanzare() {
    }

    public Vanzare(Integer masinaId, Integer clientId, Integer agentId,
                   Date dataVanzare, Double pretFinal,
                   String tipTranzactie, Double pretAchizitieMasina) {
        this.masinaId = masinaId;
        this.clientId = clientId;
        this.agentId = agentId;
        this.dataVanzare = dataVanzare;
        this.pretFinal = pretFinal;
        this.tipTranzactie = tipTranzactie;
        this.pretAchizitieMasina = pretAchizitieMasina;
        calculateProfit();
    }

    // ========================
    // GETTERS
    // ========================

    public Integer getId() {
        return id;
    }

    public Integer getMasinaId() {
        return masinaId;
    }

    public Integer getClientId() {
        return clientId;
    }

    public Integer getAgentId() {
        return agentId;
    }

    public Date getDataVanzare() {
        return dataVanzare;
    }

    public Double getPretFinal() {
        return pretFinal;
    }

    public String getTipTranzactie() {
        return tipTranzactie;
    }

    public Double getPretAchizitieMasina() {
        return pretAchizitieMasina;
    }

    public Double getProfit() {
        return profit;
    }

    // ========================
    // SETTERS
    // ========================

    public void setId(Integer id) {
        this.id = id;
    }

    public void setMasinaId(Integer masinaId) {
        this.masinaId = masinaId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public void setAgentId(Integer agentId) {
        this.agentId = agentId;
    }

    public void setDataVanzare(Date dataVanzare) {
        this.dataVanzare = dataVanzare;
    }

    public void setPretFinal(Double pretFinal) {
        this.pretFinal = pretFinal;
        calculateProfit();
    }

    public void setTipTranzactie(String tipTranzactie) {
        this.tipTranzactie = tipTranzactie;
    }

    public void setPretAchizitieMasina(Double pretAchizitieMasina) {
        this.pretAchizitieMasina = pretAchizitieMasina;
        calculateProfit();
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }

    // ========================
    // LOGICĂ INTERNĂ
    // ========================

    private void calculateProfit() {
        if (pretFinal != null && pretAchizitieMasina != null) {
            this.profit = pretFinal - pretAchizitieMasina;
        }
    }
}
