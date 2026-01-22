/**
 * DAO pentru autentificarea agenților în sistem.
 * Verifică credențiale și gestionează procesul de login pentru agenți.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.dao;

import com.dealerauto.app.model.Agent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AgentLoginDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Agent findByUsername(String username) {

        String sql = "SELECT * FROM agent_login WHERE username = ?";

        return jdbcTemplate.queryForObject(sql,
                new Object[]{username},
                (rs, rowNum) -> {

                    Agent a = new Agent();
                    a.setId(rs.getInt("id"));                    // id din agent_login
                    a.setUsername(rs.getString("username"));
                    a.setPassword(rs.getString("password"));
                    a.setIdAgent(rs.getInt("id_agent"));         // foreign key către agentdevanzare

                    return a;
                }
        );
    }
}
