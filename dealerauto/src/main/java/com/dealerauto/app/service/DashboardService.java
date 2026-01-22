/**
 * Service pentru agregarea și procesarea datelor statistice din dashboard.
 * Calculează KPI-uri, metrici de performanță și generează rapoarte.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.service;

import com.dealerauto.app.dao.DashboardDAO;
import com.dealerauto.app.dto.dashboard.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private DashboardDAO dashboardDAO;

    // ====================================================
    // 1. GET COMPLETE DASHBOARD STATS
    // ====================================================

    /**
     * Agregă TOATE statisticile pentru dashboard-ul principal
     * Returnează un singur obiect DashboardStats complet
     */
    public DashboardStats getCompleteDashboardStats() {
        DashboardStats stats = new DashboardStats();

        // Overview Statistics
        stats.setTotalSalesRevenue(dashboardDAO.getTotalSalesRevenue());
        stats.setTotalCarsSold(dashboardDAO.getTotalCarsSold());
        stats.setTotalProfit(dashboardDAO.getTotalProfit());
        stats.setCarsInStock(dashboardDAO.getCarsInStock());
        stats.setCarsRetracted(dashboardDAO.getCarsRetracted());

        stats.setTotalRetractedCost(dashboardDAO.getTotalRetractedCost());
        stats.setCurrentStockValue(dashboardDAO.getCurrentStockValue());
        stats.setTotalSalesAgents(dashboardDAO.getTotalSalesAgents());
        stats.setTotalMonthlySalaries(dashboardDAO.getTotalMonthlySalaries());
        stats.setTotalCustomers(dashboardDAO.getTotalCustomers());
        stats.setTotalOnlineUsers(dashboardDAO.getTotalOnlineUsers());

        // Providers KPIs
        stats.setTotalProviders(dashboardDAO.getTotalProviders());
        stats.setCompanyProviders(dashboardDAO.getCompanyProviders());
        stats.setIndividualProviders(dashboardDAO.getIndividualProviders());

        // Top Agents (top 5)
        stats.setTopAgents(dashboardDAO.getTopAgents(5));

        // Brand Statistics (top 10)
        stats.setBrandStats(dashboardDAO.getTopBrands(10));

        // Provider Statistics (top 10)
        stats.setProviderStats(dashboardDAO.getTopProviders(10));

        // Monthly Sales (ultimele 12 luni)
        stats.setMonthlySales(dashboardDAO.getMonthlySales());

        // Payment Method Distribution
        stats.setPaymentMethodStats(dashboardDAO.getPaymentMethodStats());

        return stats;
    }

    // ====================================================
    // 2. OVERVIEW STATISTICS (INDIVIDUAL)
    // ====================================================

    public Double getTotalSalesRevenue() {
        return dashboardDAO.getTotalSalesRevenue();
    }

    public Integer getTotalCarsSold() {
        return dashboardDAO.getTotalCarsSold();
    }

    public Double getTotalProfit() {
        return dashboardDAO.getTotalProfit();
    }

    public Integer getCarsInStock() {
        return dashboardDAO.getCarsInStock();
    }

    public Integer getCarsRetracted() {
        return dashboardDAO.getCarsRetracted();
    }

    // ====================================================
    // 3. AGENT PERFORMANCE
    // ====================================================

    /**
     * Top N agenți după performanță
     */
    public List<AgentPerformance> getTopAgents(int limit) {
        return dashboardDAO.getTopAgents(limit);
    }

    /**
     * Toți agenții cu statistici complete (pentru comparație)
     */
    public List<AgentPerformance> getAllAgentsPerformance() {
        return dashboardDAO.getAllAgentsPerformance();
    }

    /**
     * Calculează conversion rate pentru fiecare agent
     * (Necesită date despre câte lead-uri a avut fiecare agent - optional)
     */
    public Map<Integer, Double> getAgentConversionRates() {
        // Placeholder - implementează dacă ai tabelă de leads
        Map<Integer, Double> conversionRates = new HashMap<>();
        List<AgentPerformance> agents = dashboardDAO.getAllAgentsPerformance();

        for (AgentPerformance agent : agents) {
            // Exemplu simplu: conversie = sales count (poate fi îmbunătățit)
            conversionRates.put(agent.getAgentId(), agent.getSalesCount().doubleValue());
        }

        return conversionRates;
    }

    // ====================================================
    // 4. BRAND STATISTICS
    // ====================================================

    /**
     * Top N branduri după vânzări
     */
    public List<BrandStats> getTopBrands(int limit) {
        return dashboardDAO.getTopBrands(limit);
    }

    /**
     * Toate brandurile cu statistici
     */
    public List<BrandStats> getAllBrandStats() {
        return dashboardDAO.getAllBrandStats();
    }

    // ====================================================
    // 5. PROVIDER STATISTICS
    // ====================================================

    /**
     * Top N furnizori după performanță
     */
    public List<ProviderStats> getTopProviders(int limit) {
        return dashboardDAO.getTopProviders(limit);
    }

    /**
     * Toți furnizorii cu statistici
     */
    public List<ProviderStats> getAllProviderStats() {
        return dashboardDAO.getAllProviderStats();
    }

    /**
     * Calculează eficiența fiecărui furnizor (% mașini vândute din total furnizate)
     */
    public Map<String, Double> getProviderEfficiency() {
        Map<String, Double> efficiency = new HashMap<>();
        List<ProviderStats> providers = dashboardDAO.getAllProviderStats();

        for (ProviderStats provider : providers) {
            if (provider.getCarsSupplied() > 0) {
                double efficiencyRate = (provider.getCarsSold().doubleValue() /
                        provider.getCarsSupplied().doubleValue()) * 100;
                efficiency.put(provider.getProviderName(), efficiencyRate);
            } else {
                efficiency.put(provider.getProviderName(), 0.0);
            }
        }

        return efficiency;
    }

    // ====================================================
    // 6. MONTHLY SALES & TRENDS
    // ====================================================

    /**
     * Vânzări pe lună (ultimele 12 luni)
     */
    public List<MonthlySales> getMonthlySales() {
        return dashboardDAO.getMonthlySales();
    }

    /**
     * Calculează trendul vânzărilor (crescător/descrescător)
     * Returnează % schimbare față de luna precedentă
     */
    public Map<String, Double> getSalesTrend() {
        List<MonthlySales> monthlySales = dashboardDAO.getMonthlySales();
        Map<String, Double> trends = new HashMap<>();

        for (int i = 1; i < monthlySales.size(); i++) {
            MonthlySales current = monthlySales.get(i);
            MonthlySales previous = monthlySales.get(i - 1);

            if (previous.getRevenue() > 0) {
                double percentChange = ((current.getRevenue() - previous.getRevenue()) /
                        previous.getRevenue()) * 100;
                trends.put(current.getMonth(), percentChange);
            }
        }

        return trends;
    }

    // ====================================================
    // 7. PAYMENT METHOD DISTRIBUTION
    // ====================================================

    /**
     * Distribuția metodelor de plată
     */
    public List<PaymentMethodStats> getPaymentMethodStats() {
        return dashboardDAO.getPaymentMethodStats();
    }

    /**
     * Metodă de plată preferată (cea mai folosită)
     */
    public String getMostUsedPaymentMethod() {
        List<PaymentMethodStats> paymentStats = dashboardDAO.getPaymentMethodStats();

        if (paymentStats.isEmpty()) {
            return "N/A";
        }

        // Prima în listă (sortată DESC în DAO)
        return paymentStats.get(0).getPaymentMethod();
    }

    // ====================================================
    // 8. INVENTORY INSIGHTS
    // ====================================================

    /**
     * Average days in stock pentru mașinile vândute
     */
    public Double getAverageDaysInStock() {
        return dashboardDAO.getAverageDaysInStock();
    }

    /**
     * Distribuția pe tipul de combustibil (stoc curent)
     */
    public Map<String, Integer> getFuelTypeDistribution() {
        List<Object[]> fuelData = dashboardDAO.getFuelTypeDistribution();
        Map<String, Integer> distribution = new HashMap<>();

        for (Object[] row : fuelData) {
            distribution.put((String) row[0], (Integer) row[1]);
        }

        return distribution;
    }

    /**
     * Distribuția pe tipul de transmisie (stoc curent)
     */
    public Map<String, Integer> getTransmissionDistribution() {
        List<Object[]> transmissionData = dashboardDAO.getTransmissionDistribution();
        Map<String, Integer> distribution = new HashMap<>();

        for (Object[] row : transmissionData) {
            distribution.put((String) row[0], (Integer) row[1]);
        }

        return distribution;
    }

    // ====================================================
    // 9. PERFORMANCE METRICS
    // ====================================================

    /**
     * Profit margin mediu (%)
     */
    public Double getAverageProfitMargin() {
        Double totalRevenue = dashboardDAO.getTotalSalesRevenue();
        Double totalProfit = dashboardDAO.getTotalProfit();

        if (totalRevenue == null || totalRevenue == 0) {
            return 0.0;
        }

        return (totalProfit / totalRevenue) * 100;
    }

    /**
     * Revenue per car sold (average)
     */
    public Double getAverageRevenuePerCar() {
        Double totalRevenue = dashboardDAO.getTotalSalesRevenue();
        Integer totalCars = dashboardDAO.getTotalCarsSold();

        if (totalCars == null || totalCars == 0) {
            return 0.0;
        }

        return totalRevenue / totalCars;
    }

    /**
     * Profit per car sold (average)
     */
    public Double getAverageProfitPerCar() {
        Double totalProfit = dashboardDAO.getTotalProfit();
        Integer totalCars = dashboardDAO.getTotalCarsSold();

        if (totalCars == null || totalCars == 0) {
            return 0.0;
        }

        return totalProfit / totalCars;
    }

    // ====================================================
    // 10. KEY PERFORMANCE INDICATORS (KPIs)
    // ====================================================

    /**
     * KPIs principale pentru dashboard
     */
    public Map<String, Object> getKeyPerformanceIndicators() {
        Map<String, Object> kpis = new HashMap<>();

        kpis.put("totalRevenue", dashboardDAO.getTotalSalesRevenue());
        kpis.put("totalProfit", dashboardDAO.getTotalProfit());
        kpis.put("totalCarsSold", dashboardDAO.getTotalCarsSold());
        kpis.put("carsInStock", dashboardDAO.getCarsInStock());
        kpis.put("averageProfitMargin", getAverageProfitMargin());
        kpis.put("averageRevenuePerCar", getAverageRevenuePerCar());
        kpis.put("averageProfitPerCar", getAverageProfitPerCar());
        kpis.put("averageDaysInStock", dashboardDAO.getAverageDaysInStock());
        kpis.put("mostUsedPaymentMethod", getMostUsedPaymentMethod());

        return kpis;
    }

}