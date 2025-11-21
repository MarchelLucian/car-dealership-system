package com.dealerauto.app.dao;

import com.dealerauto.app.model.Agent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;

@Repository
public class AgentLoginDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Agent findByUsername(String username) {
        String sql = "SELECT * FROM agent_login WHERE username = ?";

        return jdbcTemplate.queryForObject(sql, new Object[]{username},
                (ResultSet rs, int rowNum) ->
                        new Agent(
                                rs.getInt("id"),
                                rs.getString("username"),
                                rs.getString("password")
                        )
        );
    }
}
