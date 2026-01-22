package com.dealerauto.app.dao;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class MarcaFurnizorDAO {

    private final JdbcTemplate jdbcTemplate;

    public MarcaFurnizorDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void insertIfNotExists(int marcaId, int furnizorId) {
        String sql = """
            INSERT INTO marcafurnizor (marca_id, furnizor_id)
            VALUES (?, ?)
            ON CONFLICT (marca_id, furnizor_id) DO NOTHING
        """;

        jdbcTemplate.update(sql, marcaId, furnizorId);
    }
}
