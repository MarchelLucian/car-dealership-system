package com.dealerauto.app.dao;

import com.dealerauto.app.model.ClientUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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

}
