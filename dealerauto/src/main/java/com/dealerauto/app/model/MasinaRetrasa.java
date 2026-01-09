package com.dealerauto.app.model;

import java.time.LocalDateTime;

public class MasinaRetrasa {

    private int id;

    // === CAR INFO (snapshot istoric) ===
    private String vin;
    private String marca;
    private String model;
    private int anFabricatie;
    private int kilometraj;
    private double pretAchizitie;
    private String combustibil;
    private String transmisie;
    private int numarLocuri;


    // === PROVIDER INFO ===
    private int providerId;
    private String providerNume;

    // === RETRACT INFO ===
    private String motiv;
    private int zileInStock;
    private LocalDateTime dataRetragere;

    // ======================
    // GETTERS & SETTERS
    // ======================

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getAnFabricatie() {
        return anFabricatie;
    }

    public void setAnFabricatie(int anFabricatie) {
        this.anFabricatie = anFabricatie;
    }

    public int getKilometraj() {
        return kilometraj;
    }

    public void setKilometraj(int kilometraj) {
        this.kilometraj = kilometraj;
    }

    public double getPretAchizitie() {
        return pretAchizitie;
    }

    public void setPretAchizitie(double pretAchizitie) {
        this.pretAchizitie = pretAchizitie;
    }

    public String getCombustibil() {
        return combustibil;
    }

    public void setCombustibil(String combustibil) {
        this.combustibil = combustibil;
    }

    public String getTransmisie() {
        return transmisie;
    }

    public void setTransmisie(String transmisie) {
        this.transmisie = transmisie;
    }

    public int getProviderId() {
        return providerId;
    }

    public void setProviderId(int providerId) {
        this.providerId = providerId;
    }

    public String getProviderNume() {
        return providerNume;
    }

    public void setProviderNume(String providerNume) {
        this.providerNume = providerNume;
    }

    public String getMotiv() {
        return motiv;
    }

    public void setMotiv(String motiv) {
        this.motiv = motiv;
    }

    public int getZileInStock() {
        return zileInStock;
    }

    public void setZileInStock(int zileInStock) {
        this.zileInStock = zileInStock;
    }

    public LocalDateTime getDataRetragere() {
        return dataRetragere;
    }

    public void setDataRetragere(LocalDateTime dataRetragere) {
        this.dataRetragere = dataRetragere;
    }


    public int getNumarLocuri() {
        return numarLocuri;
    }

    public void setNumarLocuri(int numarLocuri) {
        this.numarLocuri = numarLocuri;
    }

}
