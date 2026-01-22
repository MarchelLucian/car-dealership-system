/**
 * Controller pentru gestionarea paginii managerului cu vizualizări detaliate.
 * Afișează dashboard-uri complexe cu KPI-uri și metrici de performanță.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.controller;

import com.dealerauto.app.dao.AgentDAO;
import com.dealerauto.app.dao.DashboardDAO;
import com.dealerauto.app.dao.FurnizorDAO;
import com.dealerauto.app.dao.ManagerLoginDAO;
import com.dealerauto.app.dto.dashboard.AgentPerformance;
import com.dealerauto.app.dto.dashboard.BrandStats;
import com.dealerauto.app.dto.dashboard.ProviderStats;
import com.dealerauto.app.model.Agent;
import com.dealerauto.app.model.Furnizor;
import com.dealerauto.app.model.Manager;
import com.dealerauto.app.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Map;


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
    private ManagerLoginDAO managerDAO;

    @Autowired
    private JdbcTemplate jdbcTemplate;
    // ====================================================
    // SALES AGENTS PAGE
    // ====================================================

    @GetMapping("/sales-agents")
    public String salesAgentsPage(
            @RequestParam(defaultValue = "8") Integer fromMonth,
            @RequestParam(defaultValue = "2025") Integer fromYear,
            @RequestParam(defaultValue = "1") Integer toMonth,
            @RequestParam(defaultValue = "2026") Integer toYear,
            @RequestParam(defaultValue = "3") Integer topAgents,
            HttpSession session, Model model) {

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

        model.addAttribute("selectedFromMonth", fromMonth);
        model.addAttribute("selectedFromYear", fromYear);
        model.addAttribute("selectedToMonth", toMonth);
        model.addAttribute("selectedToYear", toYear);
        model.addAttribute("selectedTopAgents", topAgents);

        // Preia toți agenții
        List<Agent> allAgents = agentDAO.findAll();
        model.addAttribute("agents", allAgents);

        // Preia performanța agenților
        List<AgentPerformance> agentPerformance = dashboardService.getAllAgentsPerformance();
        model.addAttribute("agentPerformance", agentPerformance);

        // Date pentru chart
        List<Map<String, Object>> topAgentsData = dashboardDAO.getTopAgentsPerformanceByPeriod(
                fromMonth, fromYear, toMonth, toYear, topAgents
        );
        model.addAttribute("topAgentsData", topAgentsData);

        return "manager-sales-agents"; // manager-sales-agents.html
    }
    @GetMapping("/all-sales")
    public String allSalesPage(HttpSession session, Model model) {

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

        // Preia toți agenții pentru dropdown-ul de filtrare
        List<Agent> allAgents = agentDAO.findAll();
        model.addAttribute("agents", allAgents);

        return "manager-all-sales"; // manager-all-sales.html
    }

    // ====================================================
    // PROVIDERS PAGE
    // ====================================================

    @GetMapping("/providers")
    public String providersPage(
            @RequestParam(defaultValue = "4") Integer minCarsSold,
            HttpSession session, Model model) {
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

        model.addAttribute("selectedMinCarsSold", minCarsSold);
        // Preia toți furnizorii
        List<Furnizor> allProviders = furnizorDAO.findAll();
        model.addAttribute("providers", allProviders);

        // Preia performanța furnizorilor
        List<ProviderStats> providerStats = dashboardService.getAllProviderStats();
        model.addAttribute("providerStats", providerStats);

        // ADAUGĂ: Top 10 Most Profitable Providers (pentru chart)
        List<Map<String, Object>> topProfitableProviders = furnizorDAO.getTopProfitableProviders(minCarsSold);
        model.addAttribute("topProfitableProviders", topProfitableProviders);

        return "manager-providers"; // manager-providers.html
    }

    // ====================================================
    // ANALYTICS & REPORTS PAGE
    // ====================================================
    @Autowired DashboardDAO dashboardDAO;
    @GetMapping("/analytics")
    public String analyticsPage(
            @RequestParam(defaultValue = "2025") Integer year,
            @RequestParam(defaultValue = "1") Integer minSales,
            @RequestParam(defaultValue = "5") Integer stockCount,
            @RequestParam(defaultValue = "topBrands") String chart,
            HttpSession session, Model model) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return "redirect:/manager-login";
        }

        String managerName = (String) session.getAttribute("managerName");
        String managerSecondName = (String) session.getAttribute("managerSecondName");

        model.addAttribute("isLogged", true);
        model.addAttribute("managerName", managerName);
        model.addAttribute("managerSecondName", managerSecondName);

        model.addAttribute("selectedYear", year);
        model.addAttribute("selectedStockCount", stockCount);
        model.addAttribute("selectedChart", chart);
        model.addAttribute("selectedMinSales", minSales);


        model.addAttribute("soldPaymentMethods", dashboardService.getPaymentMethodStats());
        model.addAttribute("soldFuelDistribution", dashboardDAO.getFuelTypeDistributionSold());
        model.addAttribute("soldTransmissionDistribution", dashboardDAO.getTransmissionDistributionSold());

        // DATE PENTRU CARS IN STOCK (stare != 'vanduta')

        model.addAttribute("stockFuelDistribution", dashboardDAO.getFuelTypeDistributionStock());
        model.addAttribute("stockTransmissionDistribution", dashboardDAO.getTransmissionDistributionStock());

        List<BrandStats> soldBrands = dashboardDAO.getTopBrandsSoldByYear(year,minSales);

        model.addAttribute("soldBrandStats", soldBrands);

        model.addAttribute("stockBrandStats", dashboardDAO.getTopBrandsInStock(stockCount));

        return "manager-analytics";
    }

    // Card-uri pentru Add Staff
    @GetMapping("/add-staff")
    public String addStaffPage(HttpSession session, Model model) {
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

        return "manager-add-staff"; // manager-add-staff.html
    }

    // Pagina pentru adăugare agent
    @GetMapping("/add-staff/add-agent")
    public String addAgentPage(HttpSession session, Model model) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return "redirect:/manager-login";
        }

        String managerName = (String) session.getAttribute("managerName");
        String managerSecondName = (String) session.getAttribute("managerSecondName");

        model.addAttribute("isLogged", true);
        model.addAttribute("managerName", managerName);
        model.addAttribute("managerSecondName", managerSecondName);

        return "manager-add-agent"; // manager-add-agent.html
    }

    // POST pentru adăugare agent
    @PostMapping("/add-staff/add-agent")
    public String addAgent(
            @RequestParam String nume,
            @RequestParam String prenume,
            @RequestParam String telefon,
            @RequestParam String email,
            @RequestParam Double salariu,
            @RequestParam String username,
            @RequestParam String password,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Integer managerId = (Integer) session.getAttribute("managerId");
        if (managerId == null) {
            return "redirect:/manager-login";
        }

        try {
            // 1. Verifică dacă username-ul există deja
            if (agentDAO.usernameExists(username)) {
                redirectAttributes.addFlashAttribute("errorMessage", "Username already exists. Please choose another one.");
                redirectAttributes.addFlashAttribute("nume", nume);
                redirectAttributes.addFlashAttribute("prenume", prenume);
                redirectAttributes.addFlashAttribute("telefon", telefon);
                redirectAttributes.addFlashAttribute("email", email);
                redirectAttributes.addFlashAttribute("salariu", salariu);
                return "redirect:/manager-dashboard/add-staff/add-agent";
            }

            // 2. Insert în agentdevanzare
            String sqlAgent = "INSERT INTO agentdevanzare (nume, prenume, telefon, email, salariu) VALUES (?, ?, ?, ?, ?) RETURNING id_agent";
            Integer idAgent = jdbcTemplate.queryForObject(sqlAgent, Integer.class, nume, prenume, telefon, email, salariu);

            // 3. Insert în agent_login cu id_agent-ul generat
            String sqlLogin = "INSERT INTO agent_login (username, password, id_agent) VALUES (?, ?, ?)";
            jdbcTemplate.update(sqlLogin, username, password, idAgent);

            redirectAttributes.addFlashAttribute("successMessage", "Agent successfully added!");
            return "redirect:/manager-dashboard/add-staff/add-agent";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to add agent: " + e.getMessage());
            redirectAttributes.addFlashAttribute("nume", nume);
            redirectAttributes.addFlashAttribute("prenume", prenume);
            redirectAttributes.addFlashAttribute("telefon", telefon);
            redirectAttributes.addFlashAttribute("email", email);
            redirectAttributes.addFlashAttribute("salariu", salariu);
            return "redirect:/manager-dashboard/add-staff/add-agent";
        }
    }

    // Pagina pentru adăugare manager
    @GetMapping("/add-staff/add-manager")
    public String addManagerPage(HttpSession session, Model model) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return "redirect:/manager-login";
        }

        String managerName = (String) session.getAttribute("managerName");
        String managerSecondName = (String) session.getAttribute("managerSecondName");

        model.addAttribute("isLogged", true);
        model.addAttribute("managerName", managerName);
        model.addAttribute("managerSecondName", managerSecondName);

        return "manager-add-manager"; // manager-add-manager.html
    }

    // POST pentru adăugare manager
    @PostMapping("/add-staff/add-manager")
    public String addManager(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String nume,
            @RequestParam String prenume,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Integer managerId = (Integer) session.getAttribute("managerId");
        if (managerId == null) {
            return "redirect:/manager-login";
        }

        try {
            // Verifică dacă username-ul există
            if (managerDAO.usernameExists(username)) {
                redirectAttributes.addFlashAttribute("errorMessage", "Username already exists. Please choose another one.");
                redirectAttributes.addFlashAttribute("nume", nume);
                redirectAttributes.addFlashAttribute("prenume", prenume);
                return "redirect:/manager-dashboard/add-staff/add-manager";
            }

            // Insert în manager
            String sql = "INSERT INTO manager_login (username, password, nume, prenume) VALUES (?, ?, ?, ?)";
            jdbcTemplate.update(sql, username, password, nume, prenume);

            redirectAttributes.addFlashAttribute("successMessage", "Manager successfully added!");
            return "redirect:/manager-dashboard/add-staff/add-manager";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to add manager: " + e.getMessage());
            redirectAttributes.addFlashAttribute("nume", nume);
            redirectAttributes.addFlashAttribute("prenume", prenume);
            return "redirect:/manager-dashboard/add-staff/add-manager";
        }
    }

    // Pagina pentru remove agent
    @GetMapping("/add-staff/remove-agent")
    public String removeAgentPage(HttpSession session, Model model) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return "redirect:/manager-login";
        }

        String managerName = (String) session.getAttribute("managerName");
        String managerSecondName = (String) session.getAttribute("managerSecondName");

        model.addAttribute("isLogged", true);
        model.addAttribute("managerName", managerName);
        model.addAttribute("managerSecondName", managerSecondName);

        // Preia toți agenții
        List<Agent> agents = agentDAO.findAll();
        model.addAttribute("agents", agents);

        return "manager-remove-agent"; // manager-remove-agent.html
    }

    // POST pentru ștergere agent
    @PostMapping("/add-staff/remove-agent")
    public String removeAgent(
            @RequestParam Integer idAgent,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Integer managerId = (Integer) session.getAttribute("managerId");
        if (managerId == null) {
            return "redirect:/manager-login";
        }

        // PROTECȚIE pentru agenții inițiali (ID 1-5)
        if (idAgent <= 5) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "This agent cannot be removed. Original agents (ID 1-5) are protected to preserve historical sales data.");
            return "redirect:/manager-dashboard/add-staff/remove-agent";
        }

        try {
            String sqlLogin = "DELETE FROM agent_login WHERE id_agent = ?";
            jdbcTemplate.update(sqlLogin, idAgent);

            String sqlAgent = "DELETE FROM agentdevanzare WHERE id_agent = ?";
            jdbcTemplate.update(sqlAgent, idAgent);

            redirectAttributes.addFlashAttribute("successMessage", "Agent successfully removed!");
            return "redirect:/manager-dashboard/add-staff/remove-agent";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to remove agent: " + e.getMessage());
            return "redirect:/manager-dashboard/add-staff/remove-agent";
        }
    }

    // Pagina pentru remove manager
    @GetMapping("/add-staff/remove-manager")
    public String removeManagerPage(HttpSession session, Model model) {
        Integer managerId = (Integer) session.getAttribute("managerId");

        if (managerId == null) {
            return "redirect:/manager-login";
        }

        String managerName = (String) session.getAttribute("managerName");
        String managerSecondName = (String) session.getAttribute("managerSecondName");

        model.addAttribute("isLogged", true);
        model.addAttribute("managerName", managerName);
        model.addAttribute("managerSecondName", managerSecondName);
        model.addAttribute("currentManagerId", managerId);

        // Preia toți managerii
        List<Manager> managers = managerDAO.findAll();
        model.addAttribute("managers", managers);

        return "manager-remove-manager"; // manager-remove-manager.html
    }

    // POST pentru ștergere manager
    @PostMapping("/add-staff/remove-manager")
    public String removeManager(
            @RequestParam Integer id,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Integer managerId = (Integer) session.getAttribute("managerId");
        if (managerId == null) {
            return "redirect:/manager-login";
        }

        // Verifică să nu-și șteargă propriul cont
        if (id.equals(managerId)) {
            redirectAttributes.addFlashAttribute("errorMessage", "You cannot delete your own account!");
            return "redirect:/manager-dashboard/add-staff/remove-manager";
        }

        try {
            String sql = "DELETE FROM manager_login WHERE id = ?";
            jdbcTemplate.update(sql, id);

            redirectAttributes.addFlashAttribute("successMessage", "Manager successfully removed!");
            return "redirect:/manager-dashboard/add-staff/remove-manager";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to remove manager: " + e.getMessage());
            return "redirect:/manager-dashboard/add-staff/remove-manager";
        }
    }

}