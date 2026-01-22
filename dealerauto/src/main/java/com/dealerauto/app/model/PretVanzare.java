/**
 * Model reprezentând un preț de vânzare asociat unei mașini.
 * Stochează istoricul prețurilor și prețul curent de vânzare.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.model;

import java.time.LocalDateTime;

public class PretVanzare {

    private int masinaId;
    private Double pretVanzare;
    private LocalDateTime dataActualizare;

    public PretVanzare() {}

    public PretVanzare(int masinaId, Double pretVanzare, LocalDateTime dataActualizare) {
        this.masinaId = masinaId;
        this.pretVanzare = pretVanzare;
        this.dataActualizare = dataActualizare;
    }

    // Getters & Setters

    public int getMasinaId() {
        return masinaId;
    }

    public void setMasinaId(int masinaId) {
        this.masinaId = masinaId;
    }

    public Double getPretVanzare() {
        return pretVanzare;
    }

    public void setPretVanzare(Double pretVanzare) {
        this.pretVanzare = pretVanzare;
    }

    public LocalDateTime getDataActualizare() {
        return dataActualizare;
    }

    public void setDataActualizare(LocalDateTime dataActualizare) {
        this.dataActualizare = dataActualizare;
    }
}