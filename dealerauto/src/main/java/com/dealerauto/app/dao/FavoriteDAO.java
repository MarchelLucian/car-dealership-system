/**
 * DAO pentru gestionarea sistemului de favorite al clienților.
 * Permite salvarea și gestionarea mașinilor preferate de fiecare client.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.dao;

import com.dealerauto.app.model.Favorite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class FavoriteDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper pentru Favorite
    private static class FavoriteRowMapper implements RowMapper<Favorite> {
        @Override
        public Favorite mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Favorite(
                    rs.getInt("id"),
                    rs.getInt("client_id"),
                    rs.getInt("masina_id"),
                    rs.getTimestamp("data_adaugare").toLocalDateTime()
            );
        }
    }

    /**
     * Adaugă o mașină la favorite
     */
    public void addFavorite(Integer clientId, Integer masinaId) {
        String sql = "INSERT INTO favorite (client_id, masina_id) VALUES (?, ?) " +
                "ON CONFLICT (client_id, masina_id) DO NOTHING";
        jdbcTemplate.update(sql, clientId, masinaId);
    }

    /**
     * Șterge o mașină de la favorite
     */
    public void removeFavorite(Integer clientId, Integer masinaId) {
        String sql = "DELETE FROM favorite WHERE client_id = ? AND masina_id = ?";
        jdbcTemplate.update(sql, clientId, masinaId);
    }

    /**
     * Verifică dacă o mașină este la favorite
     */
    public boolean isFavorite(Integer clientId, Integer masinaId) {
        String sql = "SELECT COUNT(*) FROM favorite WHERE client_id = ? AND masina_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, clientId, masinaId);
        return count != null && count > 0;
    }

    /**
     * Găsește toate favorite-urile unui client
     */
    public List<Favorite> findByClientId(Integer clientId) {
        String sql = "SELECT * FROM favorite WHERE client_id = ? ORDER BY data_adaugare DESC";
        return jdbcTemplate.query(sql, new FavoriteRowMapper(), clientId);
    }

    /**
     * Găsește ID-urile mașinilor favorite ale unui client
     */
    public List<Integer> findMasinaIdsByClientId(Integer clientId) {
        String sql = """
        SELECT f.masina_id 
        FROM favorite f
        INNER JOIN masina m ON f.masina_id = m.id
        WHERE f.client_id = ? 
        AND m.stare = 'disponibila'
        ORDER BY f.data_adaugare DESC
    """;
        return jdbcTemplate.queryForList(sql, Integer.class, clientId);
    }

    /**
     * Numără câte favorite are un client
     */
    public long countByClientId(Integer clientId) {
        String sql = "SELECT COUNT(*) FROM favorite WHERE client_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, clientId);
        return count != null ? count : 0;
    }

    /**
     * Găsește un favorite specific
     */
    public Optional<Favorite> findByClientIdAndMasinaId(Integer clientId, Integer masinaId) {
        String sql = "SELECT * FROM favorite WHERE client_id = ? AND masina_id = ?";
        try {
            Favorite favorite = jdbcTemplate.queryForObject(sql, new FavoriteRowMapper(), clientId, masinaId);
            return Optional.ofNullable(favorite);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Șterge toate favoritele pentru o mașină (când e vândută)
     */
    public void deleteByMasinaId(Integer masinaId) {
        String sql = "DELETE FROM favorite WHERE masina_id = ?";
        jdbcTemplate.update(sql, masinaId);
    }
}