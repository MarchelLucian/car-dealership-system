package com.dealerauto.app.dao;

import com.dealerauto.app.dto.SaleViewDTO;
import com.dealerauto.app.model.Vanzare;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.time.LocalDate;
import java.util.List;

@Repository
public class VanzareDAO {

    private final JdbcTemplate jdbcTemplate;

    public VanzareDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // ============================
    // INSERT VANZARE
    // ============================
    public void insert(Vanzare v) {

        String sql = """
        INSERT INTO vanzare (
            masina_id,
            client_id,
            agent_id,
            data_vanzare,
            pret_final,
            tip_tranzactie,
            pret_achizitie_masina
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """;

        jdbcTemplate.update(
                sql,
                v.getMasinaId(),
                v.getClientId(),
                v.getAgentId(),
                v.getDataVanzare(),   // java.sql.Date ✔
                v.getPretFinal(),
                v.getTipTranzactie(), // "cash", "leasing", etc.
                v.getPretAchizitieMasina()
        );
    }



    // ============================
    // LIST ALL SALES (opțional)
    // ============================
    public List<Vanzare> findAll() {
        String sql = "SELECT * FROM vanzare ORDER BY data_vanzare DESC";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Vanzare v = new Vanzare();
            v.setId(rs.getInt("id"));
            v.setMasinaId(rs.getInt("masina_id"));
            v.setClientId(rs.getInt("client_id"));
            v.setAgentId(rs.getInt("agent_id"));
            v.setDataVanzare(rs.getDate("data_vanzare").toLocalDate());
            v.setPretFinal(rs.getDouble("pret_final"));
            v.setTipTranzactie(rs.getString("tip_tranzactie"));
            v.setPretAchizitieMasina(rs.getDouble("pret_achizitie_masina"));
            v.setProfit(rs.getDouble("profit"));
            return v;
        });
    }

    public List<SaleViewDTO> findSalesByAgentId(int agentId) {
        String sql = """
   SELECT
       v.id AS sale_id,
       v.masina_id,
       CONCAT(m.marca_nume, ' ', m.model) AS car_name,
       vc.vin,
       c.id AS client_id,
       CASE
           WHEN c.tip_client = 'persoana fizica'
               THEN CONCAT(COALESCE(c.prenume, ''), ' ', COALESCE(c.nume, ''))
           ELSE COALESCE(c.nume, '')
       END AS client_name,
       c.tip_client AS client_type,
       v.data_vanzare,
       m.data_intrare_stoc,
       v.pret_final,
       v.profit,
       v.tip_tranzactie
   FROM vanzare v
   JOIN masina m ON v.masina_id = m.id
   LEFT JOIN vin_corelare vc ON vc.masina_id = m.id
   JOIN client c ON v.client_id = c.id
   WHERE v.agent_id = ?
   ORDER BY v.data_vanzare DESC
   """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            SaleViewDTO dto = new SaleViewDTO();
            dto.setSaleId(rs.getInt("sale_id"));
            dto.setMasinaId(rs.getInt("masina_id"));
            dto.setCarName(rs.getString("car_name"));
            dto.setVin(rs.getString("vin"));
            dto.setClientId(rs.getInt("client_id"));
            dto.setClientName(rs.getString("client_name"));
            dto.setClientType(rs.getString("client_type"));
            dto.setSaleDate(rs.getDate("data_vanzare"));

            Date entryDate = rs.getDate("data_intrare_stoc");
            dto.setDataIntrareStoc(
                    entryDate != null ? entryDate.toLocalDate() : null
            );

            dto.setFinalPrice(rs.getDouble("pret_final"));
            dto.setProfit(rs.getDouble("profit"));
            dto.setPaymentType(rs.getString("tip_tranzactie"));

            // ===== LOGICA STATUS =====
            LocalDate cutoff = LocalDate.of(2025, 3, 1);
            LocalDate saleDate = rs.getDate("data_vanzare").toLocalDate();
            String paymentType = rs.getString("tip_tranzactie");

            boolean pending =
                    (paymentType.equalsIgnoreCase("leasing")
                            || paymentType.equalsIgnoreCase("rate"))
                            && saleDate.isAfter(cutoff);

            dto.setStatus(pending ? "PENDING" : "PAID");
            return dto;
        }, agentId);
    }

    public List<String> findDistinctClientNames(String query) {
        String sql = """
        SELECT DISTINCT
        CASE
            WHEN tip_client = 'persoana fizica'
            THEN CONCAT(prenume, ' ', nume)
            ELSE nume
        END AS client_name
        FROM client
        WHERE LOWER(nume) LIKE ?
           OR LOWER(prenume) LIKE ?
    """;

        String q = "%" + query.toLowerCase() + "%";
        return jdbcTemplate.query(sql, (rs, i) -> rs.getString("client_name"), q, q);
    }


    /**
     * Găsește toate vânzările unui client
     */
    public List<Vanzare> findByClientId(Integer clientId) {
        String sql = "SELECT * FROM vanzare WHERE client_id = ? ORDER BY data_vanzare DESC";
        return jdbcTemplate.query(sql, new VanzareRowMapper(), clientId);
    }

    /**
     * RowMapper pentru Vanzare
     */
    private static class VanzareRowMapper implements RowMapper<Vanzare> {
        @Override
        public Vanzare mapRow(ResultSet rs, int rowNum) throws SQLException {
            Vanzare v = new Vanzare();
            v.setId(rs.getInt("id"));
            v.setMasinaId(rs.getInt("masina_id"));
            v.setClientId(rs.getInt("client_id"));
            v.setAgentId(rs.getInt("agent_id"));

            if (rs.getDate("data_vanzare") != null) {
                v.setDataVanzare(rs.getDate("data_vanzare").toLocalDate());
            }

            v.setPretFinal(rs.getDouble("pret_final"));
            v.setTipTranzactie(rs.getString("tip_tranzactie"));

            return v;
        }
    }

}
