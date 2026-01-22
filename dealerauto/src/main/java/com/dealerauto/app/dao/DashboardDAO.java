/**
 * DAO pentru gestionarea datelor statistice afișate în dashboard.
 * Agregă și procesează date pentru metrici de performanță.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.dao;

import com.dealerauto.app.dto.dashboard.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class DashboardDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ====================================================
    // 1. OVERVIEW STATISTICS
    // ====================================================

    /**
     * Total revenue din toate vânzările
     */
    public Double getTotalSalesRevenue() {
        String sql = "SELECT COALESCE(SUM(pret_final), 0) FROM vanzare";
        return jdbcTemplate.queryForObject(sql, Double.class);
    }

    /**
     * Număr total de mașini vândute
     */
    public Integer getTotalCarsSold() {
        String sql = "SELECT COUNT(*) FROM vanzare";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    /**
     * Profit total (sumă din coloana profit)
     */
    public Double getTotalProfit() {
        String sql = "SELECT COALESCE(SUM(profit), 0) FROM vanzare";
        return jdbcTemplate.queryForObject(sql, Double.class);
    }

    /**
     * Mașini în stoc (disponibile)
     */
    public Integer getCarsInStock() {
        String sql = "SELECT COUNT(*) FROM masina WHERE stare != 'vanduta'";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    /**
     * Mașini retrase
     */
    public Integer getCarsRetracted() {
        String sql = "SELECT COUNT(*) FROM masini_retrase";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    // ====================================================
    // 2. AGENT PERFORMANCE
    // ====================================================

    /**
     * Top agenți după număr de vânzări și profit
     * @param limit - câți agenți să returneze (ex: top 5)
     */
    public List<AgentPerformance> getTopAgents(int limit) {
        String sql = """
        SELECT 
            a.id_agent AS agentId,
            CONCAT(a.prenume, ' ', a.nume) AS agentName,
            COUNT(v.id) AS salesCount,
            COALESCE(SUM(v.pret_final), 0) AS totalRevenue,
            COALESCE(SUM(v.profit), 0) AS totalProfit,
            COALESCE(AVG(
                CASE 
                    WHEN m.pret_achizitie > 0 
                    THEN ((v.pret_final - m.pret_achizitie) / m.pret_achizitie) * 100
                    ELSE 0
                END
            ), 0) AS averageMarkup
        FROM agentdevanzare a
        LEFT JOIN vanzare v ON a.id_agent = v.agent_id
        LEFT JOIN masina m ON v.masina_id = m.id
        GROUP BY a.id_agent, a.prenume, a.nume
        ORDER BY salesCount DESC, totalProfit DESC
        LIMIT ?
    """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            AgentPerformance ap = new AgentPerformance();
            ap.setAgentId(rs.getInt("agentId"));
            ap.setAgentName(rs.getString("agentName"));
            ap.setSalesCount(rs.getInt("salesCount"));
            ap.setTotalRevenue(rs.getDouble("totalRevenue"));
            ap.setTotalProfit(rs.getDouble("totalProfit"));
            ap.setAverageMarkup(rs.getDouble("averageMarkup"));
            return ap;
        }, limit);
    }

    /**
     * Performanța TUTUROR agenților (pentru grafice comparative)
     */
    public List<AgentPerformance> getAllAgentsPerformance() {
        String sql = """
        SELECT 
            a.id_agent AS agentId,
            CONCAT(a.prenume, ' ', a.nume) AS agentName,
            COUNT(v.id) AS salesCount,
            COALESCE(SUM(v.pret_final), 0) AS totalRevenue,
            COALESCE(SUM(v.profit), 0) AS totalProfit,
            COALESCE(AVG(
                CASE 
                    WHEN m.pret_achizitie > 0 
                    THEN ((v.pret_final - m.pret_achizitie) / m.pret_achizitie) * 100
                    ELSE 0
                END
            ), 0) AS averageMarkup
        FROM agentdevanzare a
        LEFT JOIN vanzare v ON a.id_agent = v.agent_id
        LEFT JOIN masina m ON v.masina_id = m.id
        GROUP BY a.id_agent, a.prenume, a.nume
        ORDER BY salesCount DESC
    """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            AgentPerformance ap = new AgentPerformance();
            ap.setAgentId(rs.getInt("agentId"));
            ap.setAgentName(rs.getString("agentName"));
            ap.setSalesCount(rs.getInt("salesCount"));
            ap.setTotalRevenue(rs.getDouble("totalRevenue"));
            ap.setTotalProfit(rs.getDouble("totalProfit"));
            ap.setAverageMarkup(rs.getDouble("averageMarkup"));
            return ap;
        });
    }

    // ====================================================
    // 3. BRAND STATISTICS
    // ====================================================

    /**
     * Statistici pe brand (top brands după vânzări)
     * @param limit - câte branduri să returneze (ex: top 10)
     */
    public List<BrandStats> getTopBrands(int limit) {
        String sql = """
            SELECT 
                m.marca_nume AS brand,
                COUNT(v.id) AS carsSold,
                COALESCE(AVG(v.pret_final), 0) AS avgPrice,
                COALESCE(SUM(v.pret_final), 0) AS totalRevenue
            FROM vanzare v
            JOIN masina m ON v.masina_id = m.id
            GROUP BY m.marca_nume
            ORDER BY carsSold DESC, totalRevenue DESC
            LIMIT ?
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            BrandStats bs = new BrandStats();
            bs.setBrand(rs.getString("brand"));
            bs.setCarsSold(rs.getInt("carsSold"));
            bs.setAvgPrice(rs.getDouble("avgPrice"));
            bs.setTotalRevenue(rs.getDouble("totalRevenue"));
            return bs;
        }, limit);
    }

    /**
     * Toate brandurile cu statistici (pentru grafice)
     */
    public List<BrandStats> getAllBrandStats() {
        String sql = """
            SELECT 
                m.marca_nume AS brand,
                COUNT(v.id) AS carsSold,
                COALESCE(AVG(v.pret_final), 0) AS avgPrice,
                COALESCE(SUM(v.pret_final), 0) AS totalRevenue
            FROM vanzare v
            JOIN masina m ON v.masina_id = m.id
            GROUP BY m.marca_nume
            ORDER BY carsSold DESC
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            BrandStats bs = new BrandStats();
            bs.setBrand(rs.getString("brand"));
            bs.setCarsSold(rs.getInt("carsSold"));
            bs.setAvgPrice(rs.getDouble("avgPrice"));
            bs.setTotalRevenue(rs.getDouble("totalRevenue"));
            return bs;
        });
    }

    // ====================================================
    // 4. PROVIDER STATISTICS
    // ====================================================

    /**
     * Statistici pe furnizori (provideri)
     * @param limit - câți furnizori să returneze
     */
    public List<ProviderStats> getTopProviders(int limit) {
        String sql = """
            SELECT 
                f.nume AS providerName,
                COUNT(DISTINCT m.id) AS carsSupplied,
                COUNT(v.id) AS carsSold
            FROM furnizor f
            LEFT JOIN masina m ON f.id = m.furnizor_id
            LEFT JOIN vanzare v ON m.id = v.masina_id
            GROUP BY f.id, f.nume
            ORDER BY carsSold DESC, carsSupplied DESC
            LIMIT ?
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ProviderStats ps = new ProviderStats();
            ps.setProviderName(rs.getString("providerName"));
            ps.setCarsSupplied(rs.getInt("carsSupplied"));
            ps.setCarsSold(rs.getInt("carsSold"));
            return ps;
        }, limit);
    }

    /**
     * Toți furnizorii cu statistici
     */
    public List<ProviderStats> getAllProviderStats() {
        String sql = """
            SELECT 
                f.nume AS providerName,
                COUNT(DISTINCT m.id) AS carsSupplied,
                COUNT(v.id) AS carsSold
            FROM furnizor f
            LEFT JOIN masina m ON f.id = m.furnizor_id
            LEFT JOIN vanzare v ON m.id = v.masina_id
            GROUP BY f.id, f.nume
            ORDER BY carsSold DESC
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ProviderStats ps = new ProviderStats();
            ps.setProviderName(rs.getString("providerName"));
            ps.setCarsSupplied(rs.getInt("carsSupplied"));
            ps.setCarsSold(rs.getInt("carsSold"));
            return ps;
        });
    }

    // ====================================================
    // 5. MONTHLY SALES (ULTIMELE 12 LUNI)
    // ====================================================

    /**
     * Vânzări pe lună (ultimele 12 luni)
     */
    public List<MonthlySales> getMonthlySales() {
        String sql = """
            SELECT 
                TO_CHAR(data_vanzare, 'YYYY-MM') AS month,
                COUNT(*) AS salesCount,
                COALESCE(SUM(pret_final), 0) AS revenue,
                COALESCE(SUM(profit), 0) AS profit
            FROM vanzare
            WHERE data_vanzare >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY TO_CHAR(data_vanzare, 'YYYY-MM')
            ORDER BY month ASC
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            MonthlySales ms = new MonthlySales();
            ms.setMonth(rs.getString("month"));
            ms.setSalesCount(rs.getInt("salesCount"));
            ms.setRevenue(rs.getDouble("revenue"));
            ms.setProfit(rs.getDouble("profit"));
            return ms;
        });
    }

    // ====================================================
    // 6. PAYMENT METHOD DISTRIBUTION
    // ====================================================

    /**
     * Distribuția metodelor de plată
     */
    public List<PaymentMethodStats> getPaymentMethodStats() {
        String sql = """
            SELECT 
                tip_tranzactie AS paymentMethod,
                COUNT(*) AS salesCount,
                COALESCE(SUM(pret_final), 0) AS totalRevenue
            FROM vanzare
            GROUP BY tip_tranzactie
            ORDER BY salesCount DESC
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            PaymentMethodStats pms = new PaymentMethodStats();
            pms.setPaymentMethod(rs.getString("paymentMethod"));
            pms.setSalesCount(rs.getInt("salesCount"));
            pms.setTotalRevenue(rs.getDouble("totalRevenue"));
            return pms;
        });
    }

    // ====================================================
    // 7. BONUS: ADDITIONAL INSIGHTS
    // ====================================================

    /**
     * Average days in stock (mașini vândute)

    public Double getAverageDaysInStock() {
        String sql = """
            SELECT COALESCE(AVG(DATE_PART('day', v.data_vanzare - m.data_intrare_stoc)), 0)
            FROM vanzare v
            JOIN masina m ON v.masina_id = m.id
            WHERE m.data_intrare_stoc IS NOT NULL
        """;

        return jdbcTemplate.queryForObject(sql, Double.class);
    }
     */

    /**
     * Average days in stock (mașini vândute)
     */
    public Double getAverageDaysInStock() {
        String sql = """
        SELECT COALESCE(AVG(v.data_vanzare - m.data_intrare_stoc), 0)
        FROM vanzare v
        JOIN masina m ON v.masina_id = m.id
        WHERE m.data_intrare_stoc IS NOT NULL
          AND v.data_vanzare IS NOT NULL
    """;

        return jdbcTemplate.queryForObject(sql, Double.class);
    }


    public Double getAverageDaysInStockByAgent(Integer agentId) {
        String sql = """
    SELECT COALESCE(AVG(v.data_vanzare - m.data_intrare_stoc), 0)
    FROM vanzare v
    JOIN masina m ON v.masina_id = m.id
    WHERE v.agent_id = ?
      AND m.data_intrare_stoc IS NOT NULL
      AND v.data_vanzare IS NOT NULL
    """;

        return jdbcTemplate.queryForObject(sql, Double.class, agentId);
    }

    /**
     * Fuel type distribution (stoc curent)
     */
    public List<Object[]> getFuelTypeDistribution() {
        String sql = """
            SELECT 
                combustibil,
                COUNT(*) AS count
            FROM masina
            WHERE stare = 'disponibila'
            GROUP BY combustibil
            ORDER BY count DESC
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Object[]{rs.getString("combustibil"), rs.getInt("count")}
        );
    }

    /**
     * Transmission type distribution (stoc curent)
     */
    public List<Object[]> getTransmissionDistribution() {
        String sql = """
            SELECT 
                transmisie,
                COUNT(*) AS count
            FROM masina
            WHERE stare = 'disponibila'
            GROUP BY transmisie
            ORDER BY count DESC
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Object[]{rs.getString("transmisie"), rs.getInt("count")}
        );
    }

    /**
     * Cost total pentru mașinile retrase (storage cost)
     */
    public Double getTotalRetractedCost() {
        String sql = "SELECT COALESCE(SUM(taxa_stationare), 0) FROM masini_retrase";
        return jdbcTemplate.queryForObject(sql, Double.class);
    }

    /**
     * Valoarea totală a stocului curent (mașini disponibile)
     */
    public Double getCurrentStockValue() {
        String sql = "SELECT COALESCE(SUM(pret_achizitie), 0) FROM masina WHERE stare = 'disponibila'";
        return jdbcTemplate.queryForObject(sql, Double.class);
    }

    /**
     * Număr total de agenți de vânzare
     */
    public Integer getTotalSalesAgents() {
        String sql = "SELECT COUNT(*) FROM agentdevanzare";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    /**
     * Total salarii lunare pentru toți agenții (convertite din RON în EUR)
     */
    public Double getTotalMonthlySalaries() {
        String sql = "SELECT COALESCE(SUM(salariu), 0) FROM agentdevanzare";
        return jdbcTemplate.queryForObject(sql, Double.class);
    }

    /**
     * Număr total de clienți înregistrați
     */
    public Integer getTotalCustomers() {
        String sql = "SELECT COUNT(*) FROM client";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    /**
     * Număr de utilizatori online (cu conturi active)
     */
    public Integer getTotalOnlineUsers() {
        String sql = "SELECT COUNT(*) FROM client_user";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    /**
     * Număr total de provideri
     */
    public Integer getTotalProviders() {
        String sql = "SELECT COUNT(*) FROM furnizor";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    /**
     * Număr provideri tip companie
     */
    public Integer getCompanyProviders() {
        String sql = "SELECT COUNT(*) FROM furnizor WHERE tip_furnizor = 'firma'";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    /**
     * Număr provideri tip persoană fizică
     */
    public Integer getIndividualProviders() {
        String sql = "SELECT COUNT(*) FROM furnizor WHERE tip_furnizor = 'persoana fizica'";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    /**
     * Obține statistici complete pentru o perioadă de timp specificată
     */
    public DashboardStats getStatsByDateRange(LocalDate startDate, LocalDate endDate) {

        // ========================================================
        // 1. CARS SOLD (totalCarsSold)
        // ========================================================
        String sqlSold = """
            SELECT COUNT(*) 
            FROM vanzare 
            WHERE data_vanzare BETWEEN ? AND ?
        """;
        Integer totalCarsSold = jdbcTemplate.queryForObject(sqlSold, Integer.class, startDate, endDate);

        // Obținem ID-urile mașinilor vândute în perioada
        String sqlSoldIds = """
            SELECT masina_id 
            FROM vanzare 
            WHERE data_vanzare BETWEEN ? AND ?
        """;
        List<Integer> indexiMasiniVandute = jdbcTemplate.queryForList(
                sqlSoldIds, Integer.class, startDate, endDate
        );

        // ========================================================
        // 2. TOTAL REVENUE (totalSalesRevenue)
        // ========================================================
        String sqlRevenue = """
            SELECT COALESCE(SUM(pret_final), 0) 
            FROM vanzare 
            WHERE data_vanzare BETWEEN ? AND ?
        """;
        Double totalSalesRevenue = jdbcTemplate.queryForObject(sqlRevenue, Double.class, startDate, endDate);

        // ========================================================
        // 3. TOTAL PROFIT (totalProfit)
        // ========================================================
        String sqlProfit = """
            SELECT COALESCE(SUM(profit), 0) 
            FROM vanzare 
            WHERE data_vanzare BETWEEN ? AND ?
        """;
        Double totalProfit = jdbcTemplate.queryForObject(sqlProfit, Double.class, startDate, endDate);

        // ========================================================
        // 4. PROFIT MARGIN (profitMargin)
        // ========================================================
        double profitMargin = totalSalesRevenue > 0 ? (totalProfit / totalSalesRevenue) * 100 : 0;

        // ========================================================
        // 5. CARS IN STOCK (carsInStock)
        // ========================================================

        // 5a. Mașini cu stare != 'vanduta' și data_intrare_stoc <= endDate
        String sqlStockNotSold = """
            SELECT COUNT(*) 
            FROM masina 
            WHERE stare != 'vanduta' 
            AND data_intrare_stoc <= ?
        """;
        Integer carsNotSold = jdbcTemplate.queryForObject(sqlStockNotSold, Integer.class, endDate);

        // 5b. Mașini vândute dar cu data_intrare_stoc <= endDate
        String sqlSoldinStock = """
           SELECT COUNT(*)
             FROM masina m
             JOIN vanzare v ON m.id = v.masina_id
             WHERE m.stare = 'vanduta'
             AND m.data_intrare_stoc <= ?
        """;

        Integer carsSoldInStock =
                jdbcTemplate.queryForObject(sqlSoldinStock, Integer.class, endDate);


        Integer carsInStock = carsNotSold +carsSoldInStock ;

        // ========================================================
        // 6. STOCK VALUE (currentStockValue)
        // ========================================================
        String sqlStockValue = """
        SELECT COALESCE(SUM(pret_achizitie), 0) 
        FROM masina 
        WHERE data_intrare_stoc <= ?
    """;

        Double currentStockValue = jdbcTemplate.queryForObject(sqlStockValue, Double.class, endDate);


        // ========================================================
        // 7. RETRACTED CARS (carsRetracted)
        // ========================================================
        String sqlRetracted = """
            SELECT COUNT(*) 
            FROM masini_retrase 
            WHERE data_retragere BETWEEN ? AND ?
        """;
        Integer carsRetracted = jdbcTemplate.queryForObject(
                sqlRetracted, Integer.class, startDate, endDate
        );

        // ========================================================
        // 8. RETRACTION COSTS (totalRetractedCost)
        // ========================================================
        String sqlRetractionCosts = """
            SELECT COALESCE(SUM(taxa_stationare), 0) 
            FROM masini_retrase 
            WHERE data_retragere BETWEEN ? AND ?
        """;
        Double totalRetractedCost = jdbcTemplate.queryForObject(
                sqlRetractionCosts, Double.class, startDate, endDate
        );

        // ========================================================
        // 9: CARS ADDED IN PERIOD (newCarsAdded)
        // ========================================================
        String sqlNewCars = """
        SELECT COUNT(*) 
        FROM masina 
        WHERE data_intrare_stoc BETWEEN ? AND ?
    """;
        Integer newCarsAdded = jdbcTemplate.queryForObject(sqlNewCars, Integer.class, startDate, endDate);

        // ========================================================
        // 10: NEW CARS VALUE (newCarsValue)
        // ========================================================
        String sqlNewCarsValue = """
        SELECT COALESCE(SUM(pret_achizitie), 0) 
        FROM masina 
        WHERE data_intrare_stoc BETWEEN ? AND ?
    """;
        Double newCarsValue = jdbcTemplate.queryForObject(sqlNewCarsValue, Double.class, startDate, endDate);

        // ========================================================
        // RETURN DashboardStats (constructorul cu 8 parametri)
        // ========================================================
        return new DashboardStats(
                totalCarsSold,           // int
                totalSalesRevenue,       // double
                totalProfit,             // double
                profitMargin,            // double
                carsInStock,             // int
                currentStockValue,       // double
                carsRetracted,           // int
                totalRetractedCost,       // double
                newCarsAdded,
                newCarsValue
                );
    }

    /**
     * Obține toate statisticile (all time)
     */
    public DashboardStats getAllTimeStats() {
        LocalDate startDate = LocalDate.of(2000, 1, 1);
        LocalDate endDate = LocalDate.now();
        return getStatsByDateRange(startDate, endDate);
    }

    /**
     * Brand stats pentru mașini în stoc (nevândute)
     */
    public List<BrandStats> getBrandStatsInStock() {
        String sql = """
        SELECT 
            marca_nume AS brand,
            COUNT(*) AS count
        FROM masina
        WHERE stare != 'vanduta'
        GROUP BY marca_nume
        ORDER BY count DESC
        LIMIT 10
    """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            BrandStats stats = new BrandStats();
            stats.setBrand(rs.getString("brand"));
            stats.setCarsSold(rs.getInt("count")); // Refolosim câmpul pentru count
            return stats;
        });
    }

    /**
     * Fuel distribution pentru mașini în stoc
     */
    public Map<String, Integer> getFuelTypeDistributionStock() {
        String sql = """
        SELECT combustibil, COUNT(*) AS count
        FROM masina
        WHERE stare != 'vanduta'
        GROUP BY combustibil
    """;

        List<Object[]> result = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Object[]{rs.getString("combustibil"), rs.getInt("count")}
        );

        Map<String, Integer> distribution = new HashMap<>();
        for (Object[] row : result) {
            distribution.put((String) row[0], (Integer) row[1]);
        }
        return distribution;
    }

    /**
     * Transmission distribution pentru mașini în stoc
     */
    public Map<String, Integer> getTransmissionDistributionStock() {
        String sql = """
        SELECT transmisie, COUNT(*) AS count
        FROM masina
        WHERE stare != 'vanduta'
        GROUP BY transmisie
    """;

        List<Object[]> result = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Object[]{rs.getString("transmisie"), rs.getInt("count")}
        );

        Map<String, Integer> distribution = new HashMap<>();
        for (Object[] row : result) {
            distribution.put((String) row[0], (Integer) row[1]);
        }
        return distribution;
    }

    /**
     * Fuel distribution pentru mașini vândute
     */
    public Map<String, Integer> getFuelTypeDistributionSold() {
        String sql = """
        SELECT m.combustibil, COUNT(*) AS count
        FROM masina m
        INNER JOIN vanzare v ON m.id = v.masina_id
        GROUP BY m.combustibil
    """;

        List<Object[]> result = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Object[]{rs.getString("combustibil"), rs.getInt("count")}
        );

        Map<String, Integer> distribution = new HashMap<>();
        for (Object[] row : result) {
            distribution.put((String) row[0], (Integer) row[1]);
        }
        return distribution;
    }

    /**
     * Transmission distribution pentru mașini vândute
     */
    public Map<String, Integer> getTransmissionDistributionSold() {
        String sql = """
        SELECT m.transmisie, COUNT(*) AS count
        FROM masina m
        INNER JOIN vanzare v ON m.id = v.masina_id
        GROUP BY m.transmisie
    """;

        List<Object[]> result = jdbcTemplate.query(sql, (rs, rowNum) ->
                new Object[]{rs.getString("transmisie"), rs.getInt("count")}
        );

        Map<String, Integer> distribution = new HashMap<>();
        for (Object[] row : result) {
            distribution.put((String) row[0], (Integer) row[1]);
        }
        return distribution;
    }


    /**
     * Interogarea complexa 2 // Top branduri vândute într-un an specific
     * Cu subcerere pentru branduri cu mai mult de minSalesCount vanzari din acea marca
     * Include profit total
     * @param year Anul pentru filtrare (parametru variabil)
     */
    public List<BrandStats> getTopBrandsSoldByYear(Integer year, Integer minSalesCount) {
        String sql = """
        SELECT 
            ma.nume AS brand,
            COUNT(v.id) AS cars_sold,
            COALESCE(SUM(v.profit), 0) AS total_profit
        FROM marca ma
        INNER JOIN masina m ON ma.id = m.marca_id
        INNER JOIN vanzare v ON m.id = v.masina_id
        WHERE m.stare = 'vanduta'
            AND EXTRACT(YEAR FROM v.data_vanzare) = ?
            AND ma.id IN (
                SELECT m2.marca_id
                FROM masina m2
                INNER JOIN vanzare v2 ON m2.id = v2.masina_id
                WHERE m2.marca_id IS NOT NULL
                  AND m2.stare = 'vanduta'
                  AND EXTRACT(YEAR FROM v2.data_vanzare) = ?
                GROUP BY m2.marca_id
                HAVING COUNT(m2.id) >= ?
            )
        GROUP BY ma.id, ma.nume
        ORDER BY cars_sold DESC
        LIMIT 20
    """;

        return jdbcTemplate.query(sql, new Object[]{year, year, minSalesCount}, (rs, rowNum) -> {
            BrandStats stats = new BrandStats();
            stats.setBrand(rs.getString("brand"));
            stats.setCarsSold(rs.getInt("cars_sold"));
            stats.setTotalProfit(rs.getDouble("total_profit"));
            return stats;
        });
    }
    /**
     * Interogare Complexa 3 :// Top branduri în stoc dupa numarul de masini existente
     * Cu subcerere pentru branduri cu mai mult de ? mașini în stoc
     * Include număr mașini în stoc și valoare stoc
     * @param minStockCount Număr minim de mașini în stoc (parametru variabil)
     */
    public List<BrandStats> getTopBrandsInStock(Integer minStockCount) {
        String sql = """
        SELECT 
            ma.nume AS brand,
            (
                SELECT COUNT(m3.id)
                FROM masina m3
                WHERE m3.marca_id = ma.id
                  AND m3.stare != 'vanduta'
            ) AS cars_in_stock,
            (
                SELECT COALESCE(SUM(m4.pret_achizitie), 0)
                FROM masina m4
                WHERE m4.marca_id = ma.id
                  AND m4.stare != 'vanduta'
            ) AS stock_value
        FROM marca ma
        WHERE ma.id IN (
            SELECT m2.marca_id
            FROM masina m2
            WHERE m2.marca_id IS NOT NULL 
              AND m2.stare != 'vanduta'
            GROUP BY m2.marca_id
            HAVING COUNT(m2.id) >= ?
        )
        GROUP BY ma.id
        ORDER BY cars_in_stock DESC
        LIMIT 20
    """;

        return jdbcTemplate.query(sql, new Object[]{minStockCount}, (rs, rowNum) -> {
            BrandStats stats = new BrandStats();
            stats.setBrand(rs.getString("brand"));
            stats.setCarsInStock(rs.getInt("cars_in_stock"));
            stats.setStockValue(rs.getDouble("stock_value"));
            return stats;
        });
    }

    /**
     * INTEROGARE COMPLEXĂ: Top agenți după număr de vânzări într-o perioadă
     * Cu subcereri pentru calculul sales count per agent per lună
     *
     * @param fromMonth Luna de start
     * @param fromYear Anul de start
     * @param toMonth Luna de final
     * @param toYear Anul de final
     * @param topCount Numărul de agenți din top
     */
    public List<Map<String, Object>> getTopAgentsPerformanceByPeriod(
            Integer fromMonth, Integer fromYear,
            Integer toMonth, Integer toYear,
            Integer topCount) {

        String sql = """
        WITH date_range AS (
            SELECT 
                generate_series(
                    make_date(?, ?, 1),
                    make_date(?, ?, 1),
                    '1 month'::interval
                )::date AS month_date
        ),
        agent_ranking AS (
            SELECT 
                a.id_agent,
                a.prenume || ' ' || a.nume AS agent_name,
                (
                    SELECT COUNT(v.id)
                    FROM vanzare v
                    WHERE v.agent_id = a.id_agent
                      AND v.data_vanzare >= make_date(?, ?, 1)
                      AND v.data_vanzare <= make_date(?, ?, 1) + INTERVAL '1 month' - INTERVAL '1 day'
                ) AS total_sales
            FROM agentdevanzare a
            ORDER BY total_sales DESC
            LIMIT ?
        )
        SELECT 
            ar.agent_name,
            TO_CHAR(dr.month_date, 'YYYY-MM-DD') AS month_date,
            (
                SELECT COUNT(v1.id)
                FROM vanzare v1
                WHERE v1.agent_id = (
                    SELECT a2.id_agent 
                    FROM agentdevanzare a2 
                    WHERE a2.prenume || ' ' || a2.nume = ar.agent_name
                )
                AND EXTRACT(MONTH FROM v1.data_vanzare) = EXTRACT(MONTH FROM dr.month_date)
                AND EXTRACT(YEAR FROM v1.data_vanzare) = EXTRACT(YEAR FROM dr.month_date)
            ) AS sales_count
        FROM agent_ranking ar
        CROSS JOIN date_range dr
        ORDER BY ar.agent_name, dr.month_date
    """;

        try {
            return jdbcTemplate.query(sql,
                    new Object[]{
                            fromYear, fromMonth,    // generate_series start
                            toYear, toMonth,        // generate_series end
                            fromYear, fromMonth,    // total_sales filter start
                            toYear, toMonth,        // total_sales filter end
                            topCount
                    },
                    (rs, rowNum) -> {
                        Map<String, Object> data = new HashMap<>();
                        data.put("agentName", rs.getString("agent_name"));
                        data.put("monthDate", rs.getString("month_date"));
                        data.put("salesCount", rs.getInt("sales_count"));
                        return data;
                    });
        } catch (Exception e) {
            System.err.println(" SQL Error: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }


}