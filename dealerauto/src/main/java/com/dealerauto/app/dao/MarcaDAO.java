package com.dealerauto.app.dao;

import com.dealerauto.app.model.Marca;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class MarcaDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Marca> getAllBrands() {
        String sql = "SELECT * FROM marca ORDER BY nume ASC";
        return jdbcTemplate.query(sql, new MarcaRowMapper());
    }

    public Integer findIdByName(String name) {
        String sql = "SELECT id FROM marca WHERE nume = ?";
        List<Integer> ids = jdbcTemplate.queryForList(sql, Integer.class, name);
        return ids.isEmpty() ? null : ids.get(0);
    }

    public void insert(Marca marca) {
        String sql = """
            INSERT INTO marca (nume, tara_origine)
            VALUES (?, ?)
        """;

        jdbcTemplate.update(sql,
                marca.getNume(),
                marca.getTaraOrigine()
        );
    }

}
