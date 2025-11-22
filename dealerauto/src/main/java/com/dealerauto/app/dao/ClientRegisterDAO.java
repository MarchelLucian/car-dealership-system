package com.dealerauto.app.dao;

import com.dealerauto.app.model.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ClientRegisterDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void save(Client client) {

        String sql = """
                INSERT INTO client
                (tip_client, nume, prenume, cnp, cui, telefon, email, adresa)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(sql,
                client.getTip_client(),
                client.getNume(),
                client.getPrenume(),
                client.getCnp(),
                client.getCui(),
                client.getTelefon(),
                client.getEmail(),
                client.getAdresa()
        );
    }

    public boolean emailExists(String email) {
        String sql = "SELECT COUNT(*) FROM client WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    public boolean phoneExists(String phone) {
        String sql = "SELECT COUNT(*) FROM client WHERE telefon = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, phone);
        return count != null && count > 0;
    }

    public int saveAndReturnId(Client c) {
        String sql = """
        INSERT INTO client (tip_client, nume, prenume, cnp, cui, telefon, email, adresa)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        RETURNING id
        """;

        return jdbcTemplate.queryForObject(sql, Integer.class,
                c.getTip_client(),
                c.getNume(),
                c.getPrenume(),
                c.getCnp(),
                c.getCui(),
                c.getTelefon(),
                c.getEmail(),
                c.getAdresa()
        );
    }



}
