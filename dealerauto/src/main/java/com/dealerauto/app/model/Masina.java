package com.dealerauto.app.model;

public class Masina {
    private String marca;
    private String model;
    private int an;
    private int kilometraj;
    private double pret;

    public Masina(String marca, String model, int an, int kilometraj, double pret) {
        this.marca = marca;
        this.model = model;
        this.an = an;
        this.kilometraj = kilometraj;
        this.pret = pret;
    }

    public String getMarca() { return marca; }
    public String getModel() { return model; }
    public int getAn() { return an; }
    public int getKilometraj() { return kilometraj; }
    public double getPret() { return pret; }
}
