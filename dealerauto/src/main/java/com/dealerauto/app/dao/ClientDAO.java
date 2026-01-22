/**
 * DAO pentru gestionarea operațiunilor de acces la date pentru entitatea Client.
 * Oferă metode CRUD, validări unicitate (email, telefon, CNP, CUI).
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.dao;

import com.dealerauto.app.model.Client;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class ClientDAO {

    private final JdbcTemplate jdbcTemplate;

    public ClientDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ============================
    // INSERT CLIENT (by Agent)
    // ============================
    public void insert(Client c) {

        String sql = """
            INSERT INTO client (
                tip_client,
                nume,
                prenume,
                cnp,
                cui,
                telefon,
                email,
                adresa
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """;

        jdbcTemplate.update(
                sql,
                c.getTip_client(),
                c.getNume(),
                c.getPrenume(),   // NULL pentru firmă
                c.getCnp(),       // NULL pentru firmă
                c.getCui(),       // NULL pentru persoană fizică
                c.getTelefon(),
                c.getEmail(),
                c.getAdresa()
        );
    }

    // ============================
    // FIND BY CNP OR CUI
    // ============================
    public Client findByCnpOrCui(String cuiCnp) {

        String sql = """
            SELECT * FROM client
            WHERE cnp = ? OR cui = ?
        """;

        return jdbcTemplate.query(sql, rs -> {
            if (!rs.next()) return null;

            Client c = new Client();
            c.setId(rs.getInt("id"));
            c.setTip_client(rs.getString("tip_client"));
            c.setNume(rs.getString("nume"));
            c.setPrenume(rs.getString("prenume"));
            c.setCnp(rs.getString("cnp"));
            c.setCui(rs.getString("cui"));
            c.setTelefon(rs.getString("telefon"));
            c.setEmail(rs.getString("email"));
            c.setAdresa(rs.getString("adresa"));
            return c;
        }, cuiCnp, cuiCnp);
    }



    /**
     * Găsește client după ID
     */
    public Client findById(Integer id) {
        String sql = "SELECT * FROM client WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new ClientRowMapper(), id);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * RowMapper pentru Client
     */
    private static class ClientRowMapper implements RowMapper<Client> {
        @Override
        public Client mapRow(ResultSet rs, int rowNum) throws SQLException {
            Client client = new Client();
            client.setId(rs.getInt("id"));
            client.setTip_client(rs.getString("tip_client"));
            client.setNume(rs.getString("nume"));
            client.setPrenume(rs.getString("prenume"));
            client.setCnp(rs.getString("cnp"));
            client.setCui(rs.getString("cui"));
            client.setTelefon(rs.getString("telefon"));
            client.setEmail(rs.getString("email"));
            client.setAdresa(rs.getString("adresa"));
            return client;
        }
    }

}
