/**
 * Service pentru gestionarea conturilor de utilizator ale clienților
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.service;

import com.dealerauto.app.dao.ClientUserDAO;
import com.dealerauto.app.model.ClientUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClientUserService {

    @Autowired
    private ClientUserDAO clientUserDAO;

    /**
     * Găsește ClientUser după client_id
     */
    public ClientUser findByClientId(Integer clientId) {
        return clientUserDAO.findByClientId(clientId);
    }

    /**
     * Actualizează parola
     */
    public void updatePassword(Integer clientId, String newPassword) {
        clientUserDAO.updatePassword(clientId, newPassword);
    }

    /**
     * Găsește ClientUser după email
     */
    public ClientUser findByEmail(String email) {
        return clientUserDAO.findByEmail(email);
    }
}