package com.dealerauto.app.dao;

import com.dealerauto.app.model.Furnizor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FurnizorDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Furnizor> getAllProviders() {
        String sql = "SELECT * FROM furnizor ORDER BY nume ASC";
        return jdbcTemplate.query(sql, new FurnizorRowMapper());
    }

    public Integer findIdByName(String name) {
        String sql = "SELECT id FROM furnizor WHERE nume = ?";
        List<Integer> ids = jdbcTemplate.queryForList(sql, Integer.class, name);
        return ids.isEmpty() ? null : ids.get(0);
    }

    public void insert(Furnizor f) {
        String sql = """
            INSERT INTO furnizor (nume, tip_furnizor, telefon, cui_cnp, adresa, tara)
            VALUES (?, ?, ?, ?, ?, ?)
        """;

        jdbcTemplate.update(sql,
                f.getNume(),
                f.getTipFurnizor(),
                f.getTelefon(),
                f.getCuiCnp(),
                f.getAdresa(),
                f.getTara()
        );
    }

    public Furnizor findById(int id) {

        String sql = """
        SELECT id, nume, tip_furnizor, telefon, cui_cnp
        FROM furnizor
        WHERE id = ?
    """;

        List<Furnizor> result = jdbcTemplate.query(
                sql,
                new Object[]{id},
                new FurnizorRowMapper()
        );

        return result.isEmpty() ? null : result.get(0);
    }

    public List<Furnizor> findAll() {
        String sql = "SELECT * FROM furnizor ORDER BY nume";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Furnizor furnizor = new Furnizor();
            furnizor.setId(rs.getInt("id"));
            furnizor.setNume(rs.getString("nume"));
            furnizor.setTipFurnizor(rs.getString("tip_furnizor"));
            furnizor.setTelefon(rs.getString("telefon"));
            furnizor.setCuiCnp(rs.getString("cui_cnp"));
            furnizor.setAdresa(rs.getString("adresa"));
            furnizor.setTara(rs.getString("tara"));
            return furnizor;
        });
    }
}
