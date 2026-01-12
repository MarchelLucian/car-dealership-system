package com.dealerauto.app.dao;

import com.dealerauto.app.dto.dashboard.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

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
        String sql = "SELECT COUNT(*) FROM masina WHERE stare = 'disponibila'";
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


}