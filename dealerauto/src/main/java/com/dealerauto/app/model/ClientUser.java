package com.dealerauto.app.model;

public class ClientUser {

    private int id;
    private int clientId;
    private String email;
    private String password;

    public ClientUser() {}

    public ClientUser(int clientId, String email, String password) {
        this.clientId = clientId;
        this.email = email;
        this.password = password;
    }

    // Getters & Setters

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public int getClientId() {
        return clientId;
    }
    public void setClientId(int clientId) {
        this.clientId = clientId;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
