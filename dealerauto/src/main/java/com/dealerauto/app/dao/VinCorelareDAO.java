package com.dealerauto.app.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class VinCorelareDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void insert(int masinaId, String vin) {
        String sql = """
            INSERT INTO vin_corelare (masina_id, vin)
            VALUES (?, ?)
        """;
        jdbcTemplate.update(sql, masinaId, vin);
    }

    public boolean existsByVin(String vin) {
        String sql = "SELECT COUNT(*) FROM vin_corelare WHERE vin = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, vin);
        return count != null && count > 0;
    }

    public String findVinByMasinaId(int masinaId) {
        String sql = "SELECT vin FROM vin_corelare WHERE masina_id = ?";

        try {
            return jdbcTemplate.queryForObject(sql, String.class, masinaId);
        } catch (EmptyResultDataAccessException e) {
            return null; // mașina nu are VIN asociat
        }
    }


    public void deleteByMasinaId(int masinaId) {
        String sql = "DELETE FROM vin_corelare WHERE masina_id = ?";
        jdbcTemplate.update(sql, masinaId);
    }

}