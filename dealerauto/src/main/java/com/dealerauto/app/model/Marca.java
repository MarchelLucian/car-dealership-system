/**
 * Model reprezentând un brand (marcă) de mașini din sistem.
 * Conține informațiile despre producătorii de vehicule disponibili.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */

package com.dealerauto.app.model;

public class Marca {

    private int id;
    private String nume;
    private String taraOrigine;

    public Marca() {}

    public Marca(int id, String nume, String taraOrigine) {
        this.id = id;
        this.nume = nume;
        this.taraOrigine = taraOrigine;
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

    public String getTaraOrigine() {
        return taraOrigine;
    }

    public void setTaraOrigine(String taraOrigine) {
        this.taraOrigine = taraOrigine;
    }
}
