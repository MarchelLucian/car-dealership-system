package com.dealerauto.app.model;

import java.time.LocalDateTime;

public class Masina {

    private int id;
    private String marca;
    private int marcaId;
    private String model;
    private String furnizor;
    private int furnizorId;
    private int an;
    private int kilometraj;
    private double pret;


    private String combustibil;    // benzina, motorina, electric, hibrid
    private String transmisie;     // manuala / automata
    private String culoare;
    private String stare;

    private int numarUsi;          // NOU
    private int numarLocuri;       // NOU

    private String vin;

    private LocalDateTime dataActualizare;

    // Constructor gol (necesar pentru RowMapper)
    public Masina() {}

    // Constructor complet (opțional)
    public Masina(int id, String marca, String model, int an, int kilometraj, double pret,
                  String combustibil, String transmisie, String culoare, String stare,
                  int numarUsi, int numarLocuri , String furnizor) {

        this.id = id;
        this.marca = marca;
        this.model = model;
        this.an = an;
        this.kilometraj = kilometraj;
        this.pret = pret;

        this.combustibil = combustibil;
        this.transmisie = transmisie;
        this.culoare = culoare;
        this.stare = stare;
        this.numarUsi = numarUsi;
        this.numarLocuri = numarLocuri;

        this.furnizor = furnizor;
    }
    // Constructor complet (EXTINS cu VIN)
    public Masina(int id, String vin, String marca, String model,
                  int an, int kilometraj, double pret,
                  String combustibil, String transmisie,
                  String culoare, String stare,
                  int numarUsi, int numarLocuri,
                  String furnizor) {

        this.id = id;
        this.vin = vin;
        this.marca = marca;
        this.model = model;
        this.an = an;
        this.kilometraj = kilometraj;
        this.pret = pret;

        this.combustibil = combustibil;
        this.transmisie = transmisie;
        this.culoare = culoare;
        this.stare = stare;
        this.numarUsi = numarUsi;
        this.numarLocuri = numarLocuri;

        this.furnizor = furnizor;
    }


    // GETTERS
    public int getId() { return id; }
    public String getMarca() { return marca; }
    public int getMarcaId() { return marcaId; }
    public String getModel() { return model; }
    public int getAn() { return an; }
    public int getKilometraj() { return kilometraj; }
    public double getPret() { return pret; }

    public String getCombustibil() { return combustibil; }
    public String getTransmisie() { return transmisie; }
    public String getCuloare() { return culoare; }
    public String getStare() { return stare; }
    public int getNumarUsi() { return numarUsi; }
    public int getNumarLocuri() { return numarLocuri; }

    public String getFurnizor() { return furnizor; }
    public int getFurnizorId() { return furnizorId; }

    public String getVin() { return vin; }
    // SETTERS
    public void setId(int id) { this.id = id; }
    public void setMarca(String marca) { this.marca = marca; }
    public void setModel(String model) { this.model = model; }
    public void setAn(int an) { this.an = an; }
    public void setKilometraj(int kilometraj) { this.kilometraj = kilometraj; }
    public void setPret(double pret) { this.pret = pret; }

    public void setCombustibil(String combustibil) { this.combustibil = combustibil; }
    public void setTransmisie(String transmisie) { this.transmisie = transmisie; }
    public void setCuloare(String culoare) { this.culoare = culoare; }
    public void setStare(String stare) { this.stare = stare; }
    public void setNumarUsi(int numarUsi) { this.numarUsi = numarUsi; }
    public void setNumarLocuri(int numarLocuri) { this.numarLocuri = numarLocuri; }

    public void setFurnizor(String furnizor) { this.furnizor = furnizor; }

    public void setMarcaId(int id) { this.marcaId = id; }
    public void setFurnizorId(int id) { this.furnizorId = id; }

    public void setVin(String vin) { this.vin = vin; }

    public LocalDateTime getDataActualizare() {
        return dataActualizare;
    }

    public void setDataActualizare(LocalDateTime dataActualizare) {
        this.dataActualizare = dataActualizare;
    }
}
