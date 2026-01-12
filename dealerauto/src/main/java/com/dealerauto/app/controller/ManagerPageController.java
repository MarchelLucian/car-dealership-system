package com.dealerauto.app.controller;

import com.dealerauto.app.dao.AgentDAO;
import com.dealerauto.app.dao.DashboardDAO;
import com.dealerauto.app.dao.FurnizorDAO;
import com.dealerauto.app.dto.dashboard.AgentPerformance;
import com.dealerauto.app.dto.dashboard.ProviderStats;
import com.dealerauto.app.model.Agent;
import com.dealerauto.app.model.Furnizor;
import com.dealerauto.app.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpSession;
import java.util.List;

@Controller
@RequestMapping("/manager-dashboard")
public class ManagerPageController {

    @Autowired
    private AgentDAO agentDAO;

    @Autowired
    private FurnizorDAO furnizorDAO;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private DashboardDAO dashboardDAO;

    // ====================================================
    // SALES AGENTS PAGE
    // ====================================================

    @GetMapping("/sales-agents")
    public String salesAgentsPage(HttpSession session, Model model) {
        // Verifică dacă managerul este logat
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return "redirect:/manager-login";
        }

        // Preia datele managerului
        String managerName = (String) session.getAttribute("managerName");
        String managerSecondName = (String) session.getAttribute("managerSecondName");

        model.addAttribute("isLogged", true);
        model.addAttribute("managerName", managerName);
        model.addAttribute("managerSecondName", managerSecondName);

        // Preia toți agenții
        List<Agent> allAgents = agentDAO.findAll();
        model.addAttribute("agents", allAgents);

        // Preia performanța agenților
        List<AgentPerformance> agentPerformance = dashboardService.getAllAgentsPerformance();
        model.addAttribute("agentPerformance", agentPerformance);

        return "manager-sales-agents"; // manager-sales-agents.html
    }

    // ====================================================
    // PROVIDERS PAGE
    // ====================================================

    @GetMapping("/providers")
    public String providersPage(HttpSession session, Model model) {
        // Verifică dacă managerul este logat
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return "redirect:/manager-login";
        }

        // Preia datele managerului
        String managerName = (String) session.getAttribute("managerName");
        String managerSecondName = (String) session.getAttribute("managerSecondName");

        model.addAttribute("isLogged", true);
        model.addAttribute("managerName", managerName);
        model.addAttribute("managerSecondName", managerSecondName);

        // Preia toți furnizorii
        List<Furnizor> allProviders = furnizorDAO.findAll();
        model.addAttribute("providers", allProviders);

        // Preia performanța furnizorilor
        List<ProviderStats> providerStats = dashboardService.getAllProviderStats();
        model.addAttribute("providerStats", providerStats);

        return "manager-providers"; // manager-providers.html
    }

    // ====================================================
    // ANALYTICS & REPORTS PAGE
    // ====================================================

    @GetMapping("/analytics")
    public String analyticsPage(HttpSession session, Model model) {
        // Verifică dacă managerul este logat
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return "redirect:/manager-login";
        }

        // Preia datele managerului
        String managerName = (String) session.getAttribute("managerName");
        String managerSecondName = (String) session.getAttribute("managerSecondName");

        model.addAttribute("isLogged", true);
        model.addAttribute("managerName", managerName);
        model.addAttribute("managerSecondName", managerSecondName);

        // Preia date pentru grafice
        model.addAttribute("monthlySales", dashboardService.getMonthlySales());
        model.addAttribute("brandStats", dashboardService.getAllBrandStats());
        model.addAttribute("paymentMethods", dashboardService.getPaymentMethodStats());
        model.addAttribute("fuelDistribution", dashboardService.getFuelTypeDistribution());
        model.addAttribute("transmissionDistribution", dashboardService.getTransmissionDistribution());

        return "manager-analytics"; // manager-analytics.html
    }
}