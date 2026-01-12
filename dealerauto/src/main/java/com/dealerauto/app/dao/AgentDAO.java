package com.dealerauto.app.dao;

import com.dealerauto.app.model.Agent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AgentDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Agent loadAgentDetails(Agent agent) {

        String sql = "SELECT * FROM agentdevanzare WHERE id_agent = ?";

        return jdbcTemplate.queryForObject(sql,
                new Object[]{agent.getIdAgent()},
                (rs, rowNum) -> {
                    agent.setNume(rs.getString("nume"));
                    agent.setPrenume(rs.getString("prenume"));
                    agent.setTelefon(rs.getString("telefon"));
                    agent.setEmail(rs.getString("email"));
                    agent.setSalariu(rs.getDouble("salariu"));
                    return agent;
                }
        );
    }

    public List<Agent> findAll() {
        String sql = "SELECT * FROM agentdevanzare ORDER BY id_agent ASC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Agent agent = new Agent();
            agent.setIdAgent(rs.getInt("id_agent"));
            agent.setNume(rs.getString("nume"));
            agent.setPrenume(rs.getString("prenume"));
            agent.setTelefon(rs.getString("telefon"));
            agent.setEmail(rs.getString("email"));
            agent.setSalariu(rs.getBigDecimal("salariu").doubleValue());
            return agent;
        });
    }
}
