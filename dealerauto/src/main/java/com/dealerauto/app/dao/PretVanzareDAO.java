package com.dealerauto.app.dao;

import com.dealerauto.app.model.PretVanzare;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;

@Repository
public class PretVanzareDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Găsește prețul de vânzare pentru o mașină
     */
    public PretVanzare findByMasinaId(Integer masinaId) {
        String sql = "SELECT * FROM preturi_vanzare WHERE masina_id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new PretVanzareRowMapper(), masinaId);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * RowMapper pentru PretVanzare
     */
    private static class PretVanzareRowMapper implements RowMapper<PretVanzare> {
        @Override
        public PretVanzare mapRow(ResultSet rs, int rowNum) throws SQLException {
            PretVanzare pret = new PretVanzare();
            pret.setMasinaId(rs.getInt("masina_id"));
            pret.setPretVanzare(rs.getDouble("pret_vanzare"));

            // data_actualizare poate fi null
            if (rs.getTimestamp("data_actualizare") != null) {
                pret.setDataActualizare(rs.getTimestamp("data_actualizare").toLocalDateTime());
            }

            return pret;
        }
    }
}