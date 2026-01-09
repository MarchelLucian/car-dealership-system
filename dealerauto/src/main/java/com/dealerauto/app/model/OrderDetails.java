package com.dealerauto.app.model;

import java.time.LocalDate;

public class OrderDetails {

    private Masina masina;
    private Vanzare vanzare;
    private Agent agent;

    public OrderDetails() {}

    public OrderDetails(Masina masina, Vanzare vanzare, Agent agent) {
        this.masina = masina;
        this.vanzare = vanzare;
        this.agent = agent;
    }

    // Getters & Setters

    public Masina getMasina() {
        return masina;
    }

    public void setMasina(Masina masina) {
        this.masina = masina;
    }

    public Vanzare getVanzare() {
        return vanzare;
    }

    public void setVanzare(Vanzare vanzare) {
        this.vanzare = vanzare;
    }

    public Agent getAgent() {
        return agent;
    }

    public void setAgent(Agent agent) {
        this.agent = agent;
    }
}