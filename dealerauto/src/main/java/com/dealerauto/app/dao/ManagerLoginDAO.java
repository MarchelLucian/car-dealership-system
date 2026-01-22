/**
 * DAO pentru gestionarea datelor de autentificare ale managerilor.
 * Verifică credențiale și gestionează accesul la funcționalități administrative.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.dao;

import com.dealerauto.app.model.Manager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

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
    /**
     * Verifică dacă username-ul există deja în manager
     */
    public boolean usernameExists(String username) {
        String sql = "SELECT COUNT(*) FROM manager_login WHERE username = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }

    public List<Manager> findAll() {
        String sql = "SELECT id, username, nume, prenume FROM manager_login ORDER BY nume, prenume";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Manager manager = new Manager();
            manager.setId(rs.getInt("id"));
            manager.setUsername(rs.getString("username"));
            manager.setNume(rs.getString("nume"));
            manager.setPrenume(rs.getString("prenume"));
            return manager;
        });
    }
}
