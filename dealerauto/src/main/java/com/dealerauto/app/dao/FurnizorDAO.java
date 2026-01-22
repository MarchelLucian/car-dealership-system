/**
 * DAO pentru gestionarea operațiunilor de acces la date pentru furnizorii dealership-ului.
 * Oferă metode CRUD pentru entitatea Furnizor.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.dao;

import com.dealerauto.app.model.Furnizor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    /**
     * INTEROGARE COMPLEXĂ: Furnizori cu număr minim de mașini vândute
     * Cu subcereri pentru calculul revenue și profit total
     *
     * @param minCarsSold Număr minim de mașini vândute
     */
    public List<Map<String, Object>> getTopProfitableProviders(Integer minCarsSold) {
        String sql = """
        SELECT 
            f.id,
            f.nume AS provider_name,
            COUNT(DISTINCT m.id) AS cars_supplied,
            (
                SELECT COUNT(DISTINCT v3.id)
                FROM vanzare v3
                INNER JOIN masina m3 ON v3.masina_id = m3.id
                WHERE m3.furnizor_id = f.id
                  AND m3.stare = 'vanduta'
            ) AS cars_sold,
            (
                SELECT COALESCE(SUM(v4.pret_achizitie_masina), 0)
                FROM vanzare v4
                INNER JOIN masina m4 ON v4.masina_id = m4.id
                WHERE m4.furnizor_id = f.id
                  AND m4.stare = 'vanduta'
            ) AS total_revenue,
            (
                SELECT COALESCE(SUM(v5.profit), 0)
                FROM vanzare v5
                INNER JOIN masina m5 ON v5.masina_id = m5.id
                WHERE m5.furnizor_id = f.id
                  AND m5.stare = 'vanduta'
            ) AS total_profit
        FROM furnizor f
        LEFT JOIN masina m ON f.id = m.furnizor_id
        WHERE f.id IN (
            SELECT m2.furnizor_id
            FROM masina m2
            INNER JOIN vanzare v2 ON m2.id = v2.masina_id
            WHERE m2.stare = 'vanduta'
              AND m2.furnizor_id IS NOT NULL
            GROUP BY m2.furnizor_id
            HAVING COUNT(DISTINCT v2.id) >= ?
        )
        GROUP BY f.id, f.nume
        ORDER BY total_revenue DESC
        LIMIT 20
    """;

        try {
            return jdbcTemplate.query(sql, new Object[]{minCarsSold}, (rs, rowNum) -> {
                Map<String, Object> provider = new HashMap<>();
                provider.put("id", rs.getInt("id"));
                provider.put("providerName", rs.getString("provider_name"));
                provider.put("carsSupplied", rs.getInt("cars_supplied"));
                provider.put("carsSold", rs.getInt("cars_sold"));
                provider.put("totalRevenue", rs.getDouble("total_revenue"));
                provider.put("totalProfit", rs.getDouble("total_profit"));
                return provider;
            });
        } catch (Exception e) {
            System.err.println(" SQL Error: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

}
