package com.dealerauto.app.dao;

import com.dealerauto.app.model.Manager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ManagerLoginDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Manager findByUsername(String username) {
        String sql = "SELECT id, username, password, nume, prenume FROM manager_login WHERE username = ?";

        try {
            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                Manager manager = new Manager();
                manager.setId(rs.getInt("id"));
                manager.setUsername(rs.getString("username"));
                manager.setPassword(rs.getString("password"));
                manager.setNume(rs.getString("nume"));           // 🆕
                manager.setPrenume(rs.getString("prenume"));     // 🆕
                return manager;
            }, username);
        } catch (Exception e) {
            return null;
        }
    }
}
