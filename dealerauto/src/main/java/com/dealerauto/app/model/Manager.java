/**
 * Model reprezentând entitatea Manager din baza de date.
 * Conține informațiile despre managerii dealership-ului cu acces administrativ.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */

package com.dealerauto.app.model;

public class Manager {
    private int id;
    private String username;
    private String password;

    //  Câmpuri noi pentru afișare în dashboard
    private String nume;           // Numele de familie
    private String prenume;        // Prenumele

    // ===== CONSTRUCTORS =====

    public Manager() {}

    public Manager(int id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public Manager(int id, String username, String password, String nume, String prenume) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.nume = nume;
        this.prenume = prenume;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNume() {
        return nume;
    }

    public void setNume(String nume) {
        this.nume = nume;
    }

    public String getPrenume() {
        return prenume;
    }

    public void setPrenume(String prenume) {
        this.prenume = prenume;
    }

    // =====HELPER METHOD =====
    public String getFullName() {
        if (prenume != null && nume != null) {
            return prenume + " " + nume;
        }
        return username; // Fallback la username
    }
}