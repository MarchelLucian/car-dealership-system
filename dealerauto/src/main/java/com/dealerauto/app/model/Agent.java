package com.dealerauto.app.model;

public class Agent {

    // din agent_login
    private int id;               // acesta rămâne id_login sau îl putem redenumi
    private String username;
    private String password;
    private int idAgent;          // FK = id-ul real din agentdevanzare

    // din agentdevanzare
    private String nume;
    private String prenume;
    private String telefon;
    private String email;
    private double salariu;

    public Agent() {}

    // constructor opțional
    public Agent(int id, String username, String password, int idAgent) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.idAgent = idAgent;
    }

    // -----------------------
    // GETTERS & SETTERS
    // -----------------------

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public int getIdAgent() { return idAgent; }
    public void setIdAgent(int idAgent) { this.idAgent = idAgent; }

    public String getNume() { return nume; }
    public void setNume(String nume) { this.nume = nume; }

    public String getPrenume() { return prenume; }
    public void setPrenume(String prenume) { this.prenume = prenume; }

    public String getTelefon() { return telefon; }
    public void setTelefon(String telefon) { this.telefon = telefon; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public double getSalariu() { return salariu; }
    public void setSalariu(double salariu) { this.salariu = salariu; }

    // Helper method
    public String getFullName() {
        return nume + " " + prenume;
    }
}
