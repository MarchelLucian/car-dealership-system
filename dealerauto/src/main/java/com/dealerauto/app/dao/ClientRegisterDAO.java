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

    public Client findByCnpOrCui(String value) {

        String sql = """
        SELECT *
        FROM client
        WHERE cnp = ? OR cui = ?
        LIMIT 1
    """;

        return jdbcTemplate.query(sql,
                rs -> {
                    if (rs.next()) {
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
                    }
                    return null;
                },
                value, value
        );
    }

    public Client findById(int id) {
        String sql = "SELECT * FROM client WHERE id = ?";

        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            Client c = new Client();
            c.setId(rs.getInt("id"));
            c.setTip_client(rs.getString("tip_client"));
            c.setTelefon(rs.getString("telefon"));
            c.setEmail(rs.getString("email"));
            return c;
        }, id);
    }
}
