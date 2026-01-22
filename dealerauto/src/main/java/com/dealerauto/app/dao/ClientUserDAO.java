/**
 * DAO pentru gestionarea conturilor de utilizator ale clienților.
 * Gestionează autentificare, parole și sesiuni pentru clienți.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.dao;

import com.dealerauto.app.model.ClientUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class ClientUserDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void save(ClientUser user) {
        String sql = "INSERT INTO client_user (client_id, email, password) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, user.getClientId(), user.getEmail(), user.getPassword());
    }

    public boolean emailExists(String email) {
        String sql = "SELECT COUNT(*) FROM client_user WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    public ClientUser findByEmail(String email) {
        String sql = "SELECT * FROM client_user WHERE email = ?";

        return jdbcTemplate.queryForObject(sql, new Object[]{email}, (rs, rowNum) ->
                new ClientUser(
                        rs.getInt("client_id"),
                        rs.getString("email"),
                        rs.getString("password")
                )
        );
    }

    public String getClientName(int clientId) {
        String sql = "SELECT nume FROM client WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, String.class, clientId);
    }

    public String getClientSecondName(int clientId) {
        String sql = "SELECT prenume FROM client WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, String.class, clientId);
    }

    /**
     * Găsește ClientUser după client_id
     */
    public ClientUser findByClientId(Integer clientId) {
        String sql = "SELECT * FROM client_user WHERE client_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new ClientUserRowMapper(), clientId);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Actualizează parola
     */
    public void updatePassword(Integer clientId, String newPassword) {
        String sql = "UPDATE client_user SET password = ? WHERE client_id = ?";
        jdbcTemplate.update(sql, newPassword, clientId);
    }

    /**
     * RowMapper pentru ClientUser (dacă nu există deja)
     */
    private static class ClientUserRowMapper implements RowMapper<ClientUser> {
        @Override
        public ClientUser mapRow(ResultSet rs, int rowNum) throws SQLException {
            ClientUser clientUser = new ClientUser();
            clientUser.setId(rs.getInt("id"));
            clientUser.setClientId(rs.getInt("client_id"));
            clientUser.setEmail(rs.getString("email"));
            clientUser.setPassword(rs.getString("password"));
            return clientUser;
        }
    }


}
