/**
 * Model reprezentând o mașină din lista de favorite a unui client.
 * Mapează relația many-to-many între clienți și mașinile preferate.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.model;

import java.time.LocalDateTime;

public class Favorite {

    private Integer id;
    private Integer clientId;
    private Integer masinaId;
    private LocalDateTime dataAdaugare;

    // Constructors
    public Favorite() {}

    public Favorite(Integer clientId, Integer masinaId) {
        this.clientId = clientId;
        this.masinaId = masinaId;
        this.dataAdaugare = LocalDateTime.now();
    }

    public Favorite(Integer id, Integer clientId, Integer masinaId, LocalDateTime dataAdaugare) {
        this.id = id;
        this.clientId = clientId;
        this.masinaId = masinaId;
        this.dataAdaugare = dataAdaugare;
    }

    // Getters & Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getClientId() {
        return clientId;
    }

    public void setClientId(Integer clientId) {
        this.clientId = clientId;
    }

    public Integer getMasinaId() {
        return masinaId;
    }

    public void setMasinaId(Integer masinaId) {
        this.masinaId = masinaId;
    }

    public LocalDateTime getDataAdaugare() {
        return dataAdaugare;
    }

    public void setDataAdaugare(LocalDateTime dataAdaugare) {
        this.dataAdaugare = dataAdaugare;
    }
}