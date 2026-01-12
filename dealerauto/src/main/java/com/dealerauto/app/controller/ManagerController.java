package com.dealerauto.app.controller;

import com.dealerauto.app.dao.ManagerLoginDAO;
import com.dealerauto.app.model.Manager;
import com.dealerauto.app.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.dealerauto.app.dto.dashboard.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@Controller
public class ManagerController {

    @Autowired
    private ManagerLoginDAO managerLoginDAO;

    // Afișează formularul de login
    @GetMapping("/manager-login")
    public String showLoginForm(@RequestParam(value = "error", required = false) String error,
                                Model model) {

        if (error != null) {
            model.addAttribute("error", "Invalid username or password! Please try again!");
        }

        return "manager-login";   // fișierul HTML din templates
    }

    // Procesează login-ul
    @PostMapping("/manager-login")
    public String handleLogin(
            @RequestParam String username,
            @RequestParam String password,
            HttpSession session,
            Model model) {

        Manager manager = managerLoginDAO.findByUsername(username);

        if (manager != null && manager.getPassword().equals(password)) {
            // Salvează în sesiune
            session.setAttribute("managerId", manager.getId());
            session.setAttribute("managerUsername", manager.getUsername());
            session.setAttribute("managerName", manager.getPrenume());
            session.setAttribute("managerSecondName", manager.getNume());

            return "redirect:/manager-dashboard";
        } else {
            model.addAttribute("error", "Invalid credentials");
            return "manager-login";
        }
    }


    @Autowired
    private DashboardService dashboardService;

    // ====================================================
    // MANAGER DASHBOARD - PAGINA PRINCIPALĂ
    // ====================================================

    /**
     * Pagina principală pentru Manager Dashboard
     */
    @GetMapping("/manager-dashboard")
    public String managerDashboard(HttpSession session, Model model) {
        // Verifică dacă managerul este logat
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return "redirect:/manager-login";
        }

        // Preia datele managerului din sesiune
        String managerName = (String) session.getAttribute("managerName");
        String managerSecondName = (String) session.getAttribute("managerSecondName");

        model.addAttribute("isLogged", true);
        model.addAttribute("managerName", managerName);
        model.addAttribute("managerSecondName", managerSecondName);

        // Preia statisticile complete
        DashboardStats stats = dashboardService.getCompleteDashboardStats();
        model.addAttribute("dashboardStats", stats);

        // KPIs principale
        Map<String, Object> kpis = dashboardService.getKeyPerformanceIndicators();
        model.addAttribute("kpis", kpis);

        return "manager-dashboard"; // manager-dashboard.html
    }

    // ====================================================
    // API ENDPOINTS - PENTRU GRAFICE ȘI DATE DINAMICE
    // ====================================================

    /**
     * API: Statistici complete (JSON pentru JavaScript)
     */
    @GetMapping("/api/manager/dashboard-stats")
    @ResponseBody
    public ResponseEntity<DashboardStats> getDashboardStats(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        DashboardStats stats = dashboardService.getCompleteDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * API: Overview statistics
     */
    @GetMapping("/api/manager/overview")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getOverviewStats(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Object> overview = Map.of(
                "totalRevenue", dashboardService.getTotalSalesRevenue(),
                "totalProfit", dashboardService.getTotalProfit(),
                "totalCarsSold", dashboardService.getTotalCarsSold(),
                "carsInStock", dashboardService.getCarsInStock(),
                "carsRetracted", dashboardService.getCarsRetracted()
        );

        return ResponseEntity.ok(overview);
    }

    /**
     * API: Top Agents
     */
    @GetMapping("/api/manager/top-agents")
    @ResponseBody
    public ResponseEntity<List<AgentPerformance>> getTopAgents(
            @RequestParam(defaultValue = "5") int limit,
            HttpSession session) {

        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        List<AgentPerformance> topAgents = dashboardService.getTopAgents(limit);
        return ResponseEntity.ok(topAgents);
    }

    /**
     * API: All Agents Performance (pentru grafice comparative)
     */
    @GetMapping("/api/manager/all-agents")
    @ResponseBody
    public ResponseEntity<List<AgentPerformance>> getAllAgentsPerformance(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        List<AgentPerformance> agents = dashboardService.getAllAgentsPerformance();
        return ResponseEntity.ok(agents);
    }

    /**
     * API: Top Brands
     */
    @GetMapping("/api/manager/top-brands")
    @ResponseBody
    public ResponseEntity<List<BrandStats>> getTopBrands(
            @RequestParam(defaultValue = "10") int limit,
            HttpSession session) {

        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        List<BrandStats> topBrands = dashboardService.getTopBrands(limit);
        return ResponseEntity.ok(topBrands);
    }

    /**
     * API: All Brand Stats
     */
    @GetMapping("/api/manager/all-brands")
    @ResponseBody
    public ResponseEntity<List<BrandStats>> getAllBrandStats(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        List<BrandStats> brands = dashboardService.getAllBrandStats();
        return ResponseEntity.ok(brands);
    }

    /**
     * API: Provider Statistics
     */
    @GetMapping("/api/manager/providers")
    @ResponseBody
    public ResponseEntity<List<ProviderStats>> getProviderStats(
            @RequestParam(defaultValue = "10") int limit,
            HttpSession session) {

        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        List<ProviderStats> providers = dashboardService.getTopProviders(limit);
        return ResponseEntity.ok(providers);
    }

    /**
     * API: Provider Efficiency (%)
     */
    @GetMapping("/api/manager/provider-efficiency")
    @ResponseBody
    public ResponseEntity<Map<String, Double>> getProviderEfficiency(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Double> efficiency = dashboardService.getProviderEfficiency();
        return ResponseEntity.ok(efficiency);
    }

    /**
     * API: Monthly Sales (ultimele 12 luni)
     */
    @GetMapping("/api/manager/monthly-sales")
    @ResponseBody
    public ResponseEntity<List<MonthlySales>> getMonthlySales(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        List<MonthlySales> monthlySales = dashboardService.getMonthlySales();
        return ResponseEntity.ok(monthlySales);
    }

    /**
     * API: Sales Trend (% change month over month)
     */
    @GetMapping("/api/manager/sales-trend")
    @ResponseBody
    public ResponseEntity<Map<String, Double>> getSalesTrend(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Double> trends = dashboardService.getSalesTrend();
        return ResponseEntity.ok(trends);
    }

    /**
     * API: Payment Method Distribution
     */
    @GetMapping("/api/manager/payment-methods")
    @ResponseBody
    public ResponseEntity<List<PaymentMethodStats>> getPaymentMethodStats(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        List<PaymentMethodStats> paymentStats = dashboardService.getPaymentMethodStats();
        return ResponseEntity.ok(paymentStats);
    }

    /**
     * API: Fuel Type Distribution (stoc curent)
     */
    @GetMapping("/api/manager/fuel-distribution")
    @ResponseBody
    public ResponseEntity<Map<String, Integer>> getFuelDistribution(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Integer> fuelDist = dashboardService.getFuelTypeDistribution();
        return ResponseEntity.ok(fuelDist);
    }

    /**
     * API: Transmission Distribution (stoc curent)
     */
    @GetMapping("/api/manager/transmission-distribution")
    @ResponseBody
    public ResponseEntity<Map<String, Integer>> getTransmissionDistribution(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Integer> transmissionDist = dashboardService.getTransmissionDistribution();
        return ResponseEntity.ok(transmissionDist);
    }

    /**
     * API: Key Performance Indicators
     */
    @GetMapping("/api/manager/kpis")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getKPIs(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Object> kpis = dashboardService.getKeyPerformanceIndicators();
        return ResponseEntity.ok(kpis);
    }

    /**
     * API: Average Days in Stock
     */
    @GetMapping("/api/manager/avg-days-in-stock")
    @ResponseBody
    public ResponseEntity<Double> getAvgDaysInStock(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        Double avgDays = dashboardService.getAverageDaysInStock();
        return ResponseEntity.ok(avgDays);
    }

    /**
     * API: Performance Metrics
     */
    @GetMapping("/api/manager/performance-metrics")
    @ResponseBody
    public ResponseEntity<Map<String, Double>> getPerformanceMetrics(HttpSession session) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Double> metrics = Map.of(
                "averageProfitMargin", dashboardService.getAverageProfitMargin(),
                "averageRevenuePerCar", dashboardService.getAverageRevenuePerCar(),
                "averageProfitPerCar", dashboardService.getAverageProfitPerCar(),
                "averageDaysInStock", dashboardService.getAverageDaysInStock()
        );

        return ResponseEntity.ok(metrics);
    }





}
