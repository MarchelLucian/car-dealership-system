/**
 * DAO pentru gestionarea relației dintre agenți și vânzările efectuate.
 * Mapează date pentru rapoarte și statistici agenți-vânzări.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.dao;

import com.dealerauto.app.model.Agent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class AgentDeVanzareDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Găsește agent după ID
     */
    public Agent findById(Integer idAgent) {
        String sql = "SELECT * FROM agentdevanzare WHERE id_agent = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new AgentRowMapper(), idAgent);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * RowMapper pentru AgentDeVanzare
     */
    private static class AgentRowMapper implements RowMapper<Agent> {
        @Override
        public Agent mapRow(ResultSet rs, int rowNum) throws SQLException {
            Agent agent = new Agent();
            agent.setIdAgent(rs.getInt("id_agent"));
            agent.setNume(rs.getString("nume"));
            agent.setPrenume(rs.getString("prenume"));
            agent.setTelefon(rs.getString("telefon"));
            agent.setEmail(rs.getString("email"));
            agent.setSalariu(rs.getDouble("salariu"));
            return agent;
        }
    }
}