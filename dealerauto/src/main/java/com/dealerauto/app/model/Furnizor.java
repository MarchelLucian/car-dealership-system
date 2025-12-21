package com.dealerauto.app.model;

public class Furnizor {

    private int id;
    private String nume;
    private String tipFurnizor;
    private String telefon;
    private String cuiCnp;
    private String adresa;
    private String tara;

    public Furnizor() {}

    public Furnizor(int id, String nume, String tipFurnizor, String telefon,
                    String cuiCnp, String adresa, String tara) {
        this.id = id;
        this.nume = nume;
        this.tipFurnizor = tipFurnizor;
        this.telefon = telefon;
        this.cuiCnp = cuiCnp;
        this.adresa = adresa;
        this.tara = tara;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNume() {
        return nume;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    public String getTipFurnizor() {
        return tipFurnizor;
    }

    public void setTipFurnizor(String tipFurnizor) {
        this.tipFurnizor = tipFurnizor;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public String getCuiCnp() {
        return cuiCnp;
    }

    public void setCuiCnp(String cuiCnp) {
        this.cuiCnp = cuiCnp;
    }

    public String getAdresa() {
        return adresa;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }

    public String getTara() {
        return tara;
    }

    public void setTara(String tara) {
        this.tara = tara;
    }
}
