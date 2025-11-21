package com.dealerauto.app.model;

public class Client {

    private int id;
    private String tip_client;
    private String nume;
    private String prenume;
    private String cnp;
    private String cui;
    private String telefon;
    private String email;
    private String adresa;

    // Constructor folosit la REGISTER (fără ID)
    public Client(String tip_client, String nume, String prenume,
                  String cnp, String cui, String telefon,
                  String email, String adresa) {

        this.tip_client = tip_client;
        this.nume = nume;
        this.prenume = prenume;
        this.cnp = cnp;
        this.cui = cui;
        this.telefon = telefon;
        this.email = email;
        this.adresa = adresa;
    }

    // Constructor complet (dacă vrei să-l folosești la selecturi)
    public Client(int id, String tip_client, String nume, String prenume,
                  String cnp, String cui, String telefon,
                  String email, String adresa) {

        this.id = id;
        this.tip_client = tip_client;
        this.nume = nume;
        this.prenume = prenume;
        this.cnp = cnp;
        this.cui = cui;
        this.telefon = telefon;
        this.email = email;
        this.adresa = adresa;
    }

    // ----------------- GETTERS -----------------

    public int getId() {
        return id;
    }

    public String getTip_client() {
        return tip_client;
    }

    public String getNume() {
        return nume;
    }

    public String getPrenume() {
        return prenume;
    }

    public String getCnp() {
        return cnp;
    }

    public String getCui() {
        return cui;
    }

    public String getTelefon() {
        return telefon;
    }

    public String getEmail() {
        return email;
    }

    public String getAdresa() {
        return adresa;
    }

    // ----------------- SETTERS -----------------

    public void setId(int id) {
        this.id = id;
    }

    public void setTip_client(String tip_client) {
        this.tip_client = tip_client;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    public void setPrenume(String prenume) {
        this.prenume = prenume;
    }

    public void setCnp(String cnp) {
        this.cnp = cnp;
    }

    public void setCui(String cui) {
        this.cui = cui;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAdresa(String adresa) {
        this.adresa = adresa;
    }
}
