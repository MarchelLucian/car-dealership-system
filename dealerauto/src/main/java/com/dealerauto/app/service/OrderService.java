/**
 * Service pentru gestionarea operațiunilor business legate de comenzi/vânzări.
 * Orchestrează procesul complet de la comandă la finalizare tranzacție.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.service;

import com.dealerauto.app.dao.VanzareDAO;
import com.dealerauto.app.dao.MasinaDAO;
import com.dealerauto.app.dao.AgentDeVanzareDAO;
import com.dealerauto.app.model.OrderDetails;
import com.dealerauto.app.model.Vanzare;
import com.dealerauto.app.model.Masina;
import com.dealerauto.app.model.Agent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private VanzareDAO vanzareDAO;

    @Autowired
    private MasinaDAO masinaDAO;

    @Autowired
    private AgentDeVanzareDAO agentDAO;

    /**
     * Găsește toate comenzile unui client cu detalii complete
     */
    public List<OrderDetails> getClientOrders(Integer clientId) {
        List<Vanzare> vanzari = vanzareDAO.findByClientId(clientId);
        List<OrderDetails> orders = new ArrayList<>();

        for (Vanzare v : vanzari) {
            Masina masina = masinaDAO.findById(v.getMasinaId());
            Agent agent = agentDAO.findById(v.getAgentId());

            if (masina != null && agent != null) {
                OrderDetails order = new OrderDetails(masina, v, agent);
                orders.add(order);
            }
        }

        return orders;
    }


}