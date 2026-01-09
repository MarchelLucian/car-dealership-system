package com.dealerauto.app.dao;

import com.dealerauto.app.model.Masina;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.util.MultiValueMap;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.*;

@Repository
public class MasinaDAO {

    private final String url = "jdbc:postgresql://localhost:5432/DealerAuto";
    private final String username = "postgres";
    private final String password = "parola123";


    public List<Masina> getAllDisponibile() {
        List<Masina> masini = new ArrayList<>();

        String sql = """
    SELECT 
        m.id,
        m.marca_nume,
        m.model,
        m.an_fabricatie,
        m.kilometraj,
        pv.pret_vanzare AS pret,
        m.combustibil,
        m.transmisie,
        m.culoare,
        m.stare,
        m.numar_usi,
        m.numar_locuri
    FROM masina m
    LEFT JOIN preturi_vanzare pv 
        ON pv.masina_id = m.id
    WHERE m.stare = 'disponibila'
    ORDER BY m.id;
    """;

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {

                Masina m = new Masina();   // folosim constructorul gol

                m.setId(rs.getInt("id"));
                m.setMarca(rs.getString("marca_nume"));
                m.setModel(rs.getString("model"));
                m.setAn(rs.getInt("an_fabricatie"));
                m.setKilometraj(rs.getInt("kilometraj"));

                double pret = rs.getDouble("pret");
                if (rs.wasNull()) {
                    pret = 0.0; // sau alt default (ex: -1, null dacă schimbi tipul)
                }
                m.setPret(pret);

                m.setCombustibil(rs.getString("combustibil"));
                m.setTransmisie(rs.getString("transmisie"));
                m.setCuloare(rs.getString("culoare"));
                m.setStare(rs.getString("stare"));
                m.setNumarUsi(rs.getInt("numar_usi"));
                m.setNumarLocuri(rs.getInt("numar_locuri"));

                masini.add(m);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return masini;
    }


    public List<String> getAllBrands() {
        List<String> brands = new ArrayList<>();

        String sql = """
        SELECT DISTINCT marca_nume
        FROM masina
        WHERE stare = 'disponibila'
        ORDER BY marca_nume ASC;
    """;

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                brands.add(rs.getString("marca_nume"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return brands;
    }

    private final JdbcTemplate jdbcTemplate;

    public MasinaDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Masina> findAllAvailable() {
        String sql = "SELECT * FROM masina WHERE stare != 'vanduta' ORDER BY id";
        return jdbcTemplate.query(sql, new MasinaRowMapper());
    }


    public List<Masina> findPage(int page, int pageSize) {
        int offset = (page - 1) * pageSize;

        String sql = """
        SELECT * 
        FROM masina 
        WHERE stare != 'vanduta'
        ORDER BY id 
        LIMIT ? OFFSET ?
        """;
        return jdbcTemplate.query(sql, new MasinaRowMapper(), pageSize, offset);
    }

    public int countAll() {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM masina", Integer.class);
    }

    public int countAvailable() {
        String sql = "SELECT COUNT(*) FROM masina WHERE stare IN ('disponibila','indisponibila')";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }


    public void toggleStatus(int id) {
        String sql = """
        UPDATE masina
        SET stare = CASE 
                        WHEN stare = 'disponibila' THEN 'indisponibila'
                        ELSE 'disponibila'
                    END
        WHERE id = ?
        """;

        jdbcTemplate.update(sql, id);
    }

    public Masina findById(int id) {
        String sql = "SELECT * FROM Masina WHERE id = ? ";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return new Masina(
                        rs.getInt("id"),
                        rs.getString("marca_nume"),
                        rs.getString("model"),
                        rs.getInt("an_fabricatie"),
                        rs.getInt("kilometraj"),
                        rs.getDouble("pret_achizitie"),
                        rs.getString("combustibil"),
                        rs.getString("transmisie"),
                        rs.getString("culoare"),
                        rs.getString("stare"),
                        rs.getInt("numar_usi"),
                        rs.getInt("numar_locuri"),
                        rs.getString("furnizor_nume")
                );
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }

    public List<String> findAllProviders() {
        List<String> providers = new ArrayList<>();
        String sql = "SELECT DISTINCT furnizor_nume FROM Masina WHERE stare != 'vanduta' ORDER BY furnizor_nume";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                providers.add(rs.getString("furnizor_nume"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return providers;
    }

    private Masina mapRowToMasina(ResultSet rs) throws SQLException {
        return new Masina(
                rs.getInt("id"),
                rs.getString("marca_nume"),
                rs.getString("model"),
                rs.getInt("an_fabricatie"),
                rs.getInt("kilometraj"),
                rs.getDouble("pret_achizitie"),
                rs.getString("combustibil"),
                rs.getString("transmisie"),
                rs.getString("culoare"),
                rs.getString("stare"),
                rs.getInt("numar_usi"),
                rs.getInt("numar_locuri"),
                rs.getString("furnizor_nume")
        );
    }

    public List<Masina> findByProvider(String provider) {
        List<Masina> list = new ArrayList<>();

        String sql = "SELECT * FROM Masina WHERE furnizor_nume = ? AND stare != 'vanduta'";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, provider);

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                list.add(mapRowToMasina(rs));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    public int countFiltered(String marca,
                             String provider,
                             Integer anMin,
                             Integer anMax,
                             Integer pretMin,
                             Integer pretMax) {

        StringBuilder sql = new StringBuilder("SELECT COUNT(*) FROM Masina WHERE stare != 'vanduta' ");

        List<Object> params = new ArrayList<>();

        if (marca != null && !marca.isEmpty()) {
            sql.append(" AND marca_nume = ? ");
            params.add(marca);
        }

        if (provider != null && !provider.isEmpty()) {
            sql.append(" AND furnizor_nume = ? ");
            params.add(provider);
        }

        if (anMin != null) {
            sql.append(" AND an >= ? ");
            params.add(anMin);
        }

        if (anMax != null) {
            sql.append(" AND an <= ? ");
            params.add(anMax);
        }

        if (pretMin != null) {
            sql.append(" AND pret >= ? ");
            params.add(pretMin);
        }

        if (pretMax != null) {
            sql.append(" AND pret <= ? ");
            params.add(pretMax);
        }

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return 0;
    }


    public List<Masina> searchFiltered(String marca,
                                       String provider,
                                       Integer anMin,
                                       Integer anMax,
                                       Integer pretMin,
                                       Integer pretMax,
                                       int page,
                                       int pageSize) {

        List<Masina> list = new ArrayList<>();

        StringBuilder sql = new StringBuilder("SELECT * FROM Masina WHERE stare != 'vanduta' ");

        List<Object> params = new ArrayList<>();

        if (marca != null && !marca.isEmpty()) {
            sql.append(" AND marca_nume = ? ");
            params.add(marca);
        }

        if (provider != null && !provider.isEmpty()) {
            sql.append(" AND furnizor_nume = ? ");
            params.add(provider);
        }

        if (anMin != null) {
            sql.append(" AND an >= ? ");
            params.add(anMin);
        }

        if (anMax != null) {
            sql.append(" AND an <= ? ");
            params.add(anMax);
        }

        if (pretMin != null) {
            sql.append(" AND pret >= ? ");
            params.add(pretMin);
        }

        if (pretMax != null) {
            sql.append(" AND pret <= ? ");
            params.add(pretMax);
        }

        // paginare
        sql.append(" ORDER BY id LIMIT ? OFFSET ? ");
        params.add(pageSize);
        params.add((page - 1) * pageSize);

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }

            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                list.add(mapRowToMasina(rs));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    public List<String> searchModels(String query) {
        String sql = "SELECT DISTINCT model FROM masina WHERE LOWER(model) LIKE LOWER(?) LIMIT 20";
        return jdbcTemplate.queryForList(sql, String.class, query + "%");
    }

    public List<Masina> findByModel(String model) {
        String sql = "SELECT * FROM masina WHERE LOWER(model) = LOWER(?)";
        return jdbcTemplate.query(sql, new MasinaRowMapper(), model);
    }

    public List<String> searchVins(String query) {
        String sql = """
        SELECT v.vin
        FROM vin_corelare v
        WHERE LOWER(v.vin) LIKE LOWER(?)
        LIMIT 10
    """;
        return jdbcTemplate.queryForList(sql, String.class, query + "%");
    }
    public List<Masina> findByVin(String vin) {
        String sql = """
        SELECT m.*
        FROM masina m
        JOIN vin_corelare v ON v.masina_id = m.id
        WHERE LOWER(v.vin) = LOWER(?)
    """;
        return jdbcTemplate.query(sql, new MasinaRowMapper(), vin);
    }



    public List<Masina> filterCars(MultiValueMap<String, String> filters) {

        StringBuilder sql = new StringBuilder("SELECT * FROM masina WHERE 1=1 ");
        sql.append(" AND stare <> 'vanduta' ");
        List<Object> params = new ArrayList<>();


        // ---------- NUMERIC ----------
        if (filters.containsKey("priceMin")) {
            sql.append(" AND pret_achizitie >= ? ");
            params.add(Integer.parseInt(filters.getFirst("priceMin")));
        }

        if (filters.containsKey("priceMax")) {
            sql.append(" AND pret_achizitie <= ? ");
            params.add(Integer.parseInt(filters.getFirst("priceMax")));
        }

        if (filters.containsKey("yearMin")) {
            sql.append(" AND an_fabricatie >= ? ");
            params.add(Integer.parseInt(filters.getFirst("yearMin")));
        }

        if (filters.containsKey("yearMax")) {
            sql.append(" AND an_fabricatie <= ? ");
            params.add(Integer.parseInt(filters.getFirst("yearMax")));
        }

        if (filters.containsKey("kmMax")) {
            sql.append(" AND kilometraj <= ? ");
            params.add(Integer.parseInt(filters.getFirst("kmMax")));
        }



        // ---------- LISTE MULTIPLE ----------

        if (filters.containsKey("brands")) {
            List<String> arr = filters.get("brands");
            sql.append(" AND marca_nume IN (")
                    .append("?,".repeat(arr.size()));
            sql.setLength(sql.length() - 1);
            sql.append(") ");

            params.addAll(arr);
        }

        if (filters.containsKey("providers")) {
            List<String> arr = filters.get("providers");
            sql.append(" AND furnizor_nume IN (")
                    .append("?,".repeat(arr.size()));
            sql.setLength(sql.length() - 1);
            sql.append(") ");

            params.addAll(arr);
        }

        if (filters.containsKey("fuels")) {
            List<String> arr = filters.get("fuels");  // MultiValueMap -> List<String>
            sql.append(" AND combustibil IN (")
                    .append("?,".repeat(arr.size()));
            sql.setLength(sql.length() - 1);
            sql.append(") ");

            params.addAll(arr);
        }

        if (filters.containsKey("transmissions")) {
            List<String> arr = filters.get("transmissions");
            sql.append(" AND transmisie IN (")
                    .append("?,".repeat(arr.size()));
            sql.setLength(sql.length() - 1);
            sql.append(") ");

            params.addAll(arr);
        }


        if (filters.containsKey("doors")) {
            List<String> arr = filters.get("doors");
            sql.append(" AND numar_usi IN (")
                    .append("?,".repeat(arr.size()));
            sql.setLength(sql.length() - 1);
            sql.append(") ");

            for (String d : arr) {
                params.add(Integer.parseInt(d));
            }
        }

        if (filters.containsKey("seats")) {
            List<String> arr = filters.get("seats");
            sql.append(" AND numar_locuri IN (")
                    .append("?,".repeat(arr.size()));
            sql.setLength(sql.length() - 1);
            sql.append(") ");

            for (String s : arr) {
                params.add(Integer.parseInt(s));
            }
        }


        sql.append(" ORDER BY id ASC ");

        return jdbcTemplate.query(
                sql.toString(),
                params.toArray(),
                new MasinaRowMapper()
        );
    }



    public int insert(Masina m) {

        String sql = """
        INSERT INTO masina 
        (marca_id, furnizor_id, marca_nume, furnizor_nume, model, an_fabricatie,
         kilometraj, combustibil, transmisie, culoare, pret_achizitie,
         numar_usi, numar_locuri)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setInt(1, m.getMarcaId());
            ps.setInt(2, m.getFurnizorId());
            ps.setString(3, m.getMarca());
            ps.setString(4, m.getFurnizor());
            ps.setString(5, m.getModel());
            ps.setInt(6, m.getAn());
            ps.setInt(7, m.getKilometraj());
            ps.setString(8, m.getCombustibil());
            ps.setString(9, m.getTransmisie());
            ps.setString(10, m.getCuloare());
            ps.setDouble(11, m.getPret());
            ps.setInt(12, m.getNumarUsi());
            ps.setInt(13, m.getNumarLocuri());
            return ps;
        }, keyHolder);

        //  AICI ESTE id ul
        return ((Number) keyHolder.getKeys().get("id")).intValue();
    }



    public Masina findAvailableById(Integer id) {
        String sql = """
            SELECT *
            FROM masina
            WHERE id = ?
              AND stare = 'disponibila'
        """;

        List<Masina> result = jdbcTemplate.query(
                sql,
                new MasinaRowMapper(),
                id
        );

        return result.isEmpty() ? null : result.get(0);
    }

    public Masina findAvailableByVin(String vin) {

        String sql = """
        SELECT m.*
        FROM masina m
        JOIN vin_corelare v ON v.masina_id = m.id
        WHERE v.vin = ?
        AND m.stare = 'disponibila'
    """;

        List<Masina> list = jdbcTemplate.query(
                sql,
                new MasinaRowMapper(),
                vin
        );

        return list.isEmpty() ? null : list.get(0);
    }

    public String findVinByMasinaId(int masinaId) {
        String sql = """
        SELECT vin
        FROM vin_corelare
        WHERE masina_id = ?
    """;

        return jdbcTemplate.queryForObject(sql, String.class, masinaId);
    }

    public void markAsSold(int masinaId) {
        String sql = "UPDATE masina SET stare = 'vanduta' WHERE id = ?";
        jdbcTemplate.update(sql, masinaId);
    }

    public Map<String, Object> findCarWithProviderById(int id) {

        String sql = """
        SELECT
            m.id AS masina_id,
            vc.vin,

            m.marca_nume AS marca,
            m.model,
            m.an_fabricatie AS an,
            m.kilometraj AS km,
            m.pret_achizitie,
            m.combustibil,
            m.transmisie,
            m.numar_locuri,

            f.id AS provider_id,
            f.nume AS provider_nume,
            f.tip_furnizor AS provider_tip,
            f.telefon AS provider_telefon,
            f.cui_cnp AS provider_cui_cnp
                
        
        FROM masina m
        JOIN vin_corelare vc ON vc.masina_id = m.id
        JOIN furnizor f ON m.furnizor_id = f.id
        WHERE m.id = ?
          AND m.stare != 'vanduta'
    """;

        return jdbcTemplate.queryForMap(sql, id);
    }

    public Map<String, Object> findCarWithProviderByVin(String vin) {

        String sql = """
        SELECT
            m.id AS masina_id,
            vc.vin,

            m.marca_nume AS marca,
            m.model,
            m.an_fabricatie AS an,
            m.kilometraj AS km,
            m.pret_achizitie,
            m.combustibil,
            m.transmisie,
            m.numar_locuri,

            f.id AS provider_id,
            f.nume AS provider_nume,
            f.tip_furnizor AS provider_tip,
            f.telefon AS provider_telefon,
            f.cui_cnp AS provider_cui_cnp
                
        
        FROM vin_corelare vc
        JOIN masina m ON vc.masina_id = m.id
        JOIN furnizor f ON m.furnizor_id = f.id
        WHERE vc.vin = ?
          AND m.stare != 'vanduta'
    """;

        return jdbcTemplate.queryForMap(sql, vin);
    }



    public void deleteById(int id) {
        String sql = "DELETE FROM masina WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public Map<String, Object> findCarForListingById(int id) {

        String sql = """
        SELECT
            m.id AS masina_id,
            vc.vin,

            m.marca_nume AS marca,
            m.model,
            m.an_fabricatie AS an,
            m.kilometraj AS km,
            m.combustibil,
            m.transmisie,
            m.culoare,
            m.numar_locuri,

            m.pret_achizitie,
            pv.pret_vanzare

        FROM masina m
        JOIN vin_corelare vc ON vc.masina_id = m.id
        JOIN preturi_vanzare pv ON pv.masina_id = m.id

        WHERE m.id = ?
          AND m.stare != 'vanduta'
    """;

        return jdbcTemplate.queryForMap(sql, id);
    }

    public Map<String, Object> findCarForListingByVin(String vin) {

        String sql = """
        SELECT
            m.id AS masina_id,
            vc.vin,

            m.marca_nume AS marca,
            m.model,
            m.an_fabricatie AS an,
            m.kilometraj AS km,
            m.combustibil,
            m.transmisie,
            m.culoare,
            m.numar_locuri,

            m.pret_achizitie,
            pv.pret_vanzare

        FROM vin_corelare vc
        JOIN masina m ON vc.masina_id = m.id
        JOIN preturi_vanzare pv ON pv.masina_id = m.id

        WHERE vc.vin = ?
          AND m.stare != 'vanduta'
    """;

        return jdbcTemplate.queryForMap(sql, vin);
    }


    public int updatePretVanzare(int masinaId, double pretVanzareNou) {

        String sql = """
        UPDATE preturi_vanzare
        SET pret_vanzare = ?,
            data_actualizare = CURRENT_TIMESTAMP
        WHERE masina_id = ?
    """;

        return jdbcTemplate.update(sql, pretVanzareNou, masinaId);
    }

    public void upsertPretVanzare(int masinaId, double pretVanzare) {

        String sql = """
        INSERT INTO preturi_vanzare (masina_id, pret_vanzare)
        VALUES (?, ?)
        ON CONFLICT (masina_id)
        DO UPDATE SET
            pret_vanzare = EXCLUDED.pret_vanzare,
            data_actualizare = CURRENT_TIMESTAMP
    """;

        jdbcTemplate.update(sql, masinaId, pretVanzare);
    }

    /**
     * Găsește mașini după lista de ID-uri
     */
    public List<Masina> findByIds(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        String sql = "SELECT * FROM masina WHERE id = ANY(?)";

        // Convertește List<Integer> la Array pentru PostgreSQL
        Integer[] idsArray = ids.toArray(new Integer[0]);

        return jdbcTemplate.query(sql, new MasinaRowMapper(), (Object) idsArray);
    }


    /**
     * Găsește datele de actualizare a prețurilor pentru toate mașinile disponibile
     * Returnează Map<masinaId, dataActualizare>
     */
    public Map<Integer, LocalDateTime> findAllActualDates() {
        String sql = """
        SELECT m.id, pv.data_actualizare
        FROM masina m
        LEFT JOIN preturi_vanzare pv ON m.id = pv.masina_id
        WHERE m.stare = 'disponibila'
    """;

        Map<Integer, LocalDateTime> dateActualizare = new HashMap<>();

        jdbcTemplate.query(sql, rs -> {
            int masinaId = rs.getInt("id");
            if (rs.getTimestamp("data_actualizare") != null) {
                LocalDateTime data = rs.getTimestamp("data_actualizare").toLocalDateTime();
                dateActualizare.put(masinaId, data);
            }
        });

        return dateActualizare;
    }

}
