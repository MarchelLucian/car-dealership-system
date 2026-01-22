/**
 * Service pentru gestionarea operațiunilor business complexe legate de clienți.
 * Coordonează validări, autentificare și procesare date client.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.service;

import com.dealerauto.app.dao.ClientDAO;
import com.dealerauto.app.model.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    @Autowired
    private ClientDAO clientDAO;

    /**
     * Găsește client după client_id
     */
    public Client getClientById(Integer clientId) {
        return clientDAO.findById(clientId);
    }

    /**
     * Traduce tip_client în engleză
     */
    public String translateClientType(String tipClient) {
        if (tipClient == null) return "Unknown";

        switch (tipClient.toLowerCase()) {
            case "persoana fizica":
                return "Individual";
            case "firma":
                return "Company";
            default:
                return tipClient;
        }
    }
}