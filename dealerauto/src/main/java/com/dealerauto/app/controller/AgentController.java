/**
 * Controller for the sales agent dashboard and operations.
 * Provides CRUD for cars, clients and sales reports.
 *
 * @author Marchel Lucian
 * @version 12 January 2026
 */

package com.dealerauto.app.controller;

import com.dealerauto.app.dao.*;
import com.dealerauto.app.model.Agent;
import com.dealerauto.app.model.Masina;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Controller
public class AgentController {

    @Autowired
    private AgentLoginDAO loginDAO;

    @Autowired
    private AgentDAO agentDAO;

    // ------------------------------
    // LOGIN FORM
    // ------------------------------
    @GetMapping("/agent-login")
    public String showLoginForm(@RequestParam(value = "error", required = false) String error, Model model) {

        if (error != null) {
            model.addAttribute("error", "Invalid username or password! Please try again!");
        }

        return "agent-login";
    }

    // ------------------------------
    // LOGIN ACTION
    // ------------------------------
    @PostMapping("/agent-login")
    public String login(@RequestParam String username,
            @RequestParam String password,
            HttpSession session) {

        try {
            Agent agent = loginDAO.findByUsername(username);

            if (agent != null && agent.getPassword().equals(password)) {

                // încărcăm detaliile personale (nume, prenume etc.)
                Agent fullAgent = agentDAO.loadAgentDetails(agent);

                // salvăm agentul complet în sesiune
                session.setAttribute("agent", fullAgent);

                return "redirect:/agent-dashboard";
            }

        } catch (Exception e) {
            return "redirect:/agent-login?error=true";
        }

        return "redirect:/agent-login?error=true";
    }

    // ------------------------------
    // AGENT DASHBOARD
    // ------------------------------
    @GetMapping("/agent-dashboard")
    public String agentDashboard(HttpSession session, Model model) {

        Agent agent = (Agent) session.getAttribute("agent");

        if (agent == null) {
            return "redirect:/agent-login";
        }

        model.addAttribute("agent", agent);
        return "agent-dashboard";
    }

    private final MasinaDAO masinaDAO;

    public AgentController(MasinaDAO masinaDAO) {
        this.masinaDAO = masinaDAO;
    }

    @Autowired
    private MarcaDAO marcaDAO;

    @Autowired
    private FurnizorDAO furnizorDAO;

    @GetMapping("/agent-dashboard/cars-management")
    public String showCarsManagementPage(HttpSession session, Model model) {

        // Transmitem agentul către pagină (pentru Agent Badge)
        Object agent = session.getAttribute("agent");
        model.addAttribute("agent", agent);

        return "cars-management"; // fișierul sales.html
    }

    @GetMapping("/agent-dashboard/cars-management/car-inventory/search-model")
    @ResponseBody
    public List<String> searchModelSuggestions(@RequestParam String query) {
        return masinaDAO.searchModels(query); // returnează lista de modele filtrate
    }

    @GetMapping("/agent-dashboard/cars-management/car-inventory/search-vin")
    @ResponseBody
    public List<String> searchVinSuggestions(@RequestParam String query) {
        return masinaDAO.searchVins(query);
    }

    @GetMapping("/agent-dashboard/cars-management/car-inventory")
    public String carInventory(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "8") int pageSize,
            @RequestParam(required = false) Integer searchId,
            @RequestParam(required = false) String modelSearch,
            @RequestParam(required = false) String vinSearch,
            @RequestParam MultiValueMap<String, String> allParams,
            Model model,
            HttpSession session) {

        Agent agent = (Agent) session.getAttribute("agent");
        model.addAttribute("agent", agent);

        model.addAttribute("brands", marcaDAO.getAllBrands());
        model.addAttribute("providers", furnizorDAO.getAllProviders());

        String sortField = allParams.getFirst("sortField") != null
                ? allParams.getFirst("sortField")
                : "price";

        String sortOrder = allParams.getFirst("sortOrder") != null
                ? allParams.getFirst("sortOrder")
                : "asc";

        model.addAttribute("sortField", sortField);
        model.addAttribute("sortOrder", sortOrder);

        /* ====== 1) SEARCH BY ID ====== */
        if (searchId != null) {
            Masina car = masinaDAO.findById(searchId);
            model.addAttribute("cars", car != null ? List.of(car) : List.of());
            model.addAttribute("notFound", car == null);
            model.addAttribute("searchId", searchId);
            model.addAttribute("currentPage", 1);
            model.addAttribute("totalPages", 1);
            model.addAttribute("pageSize", 8);
            model.addAttribute("queryString", "&searchId=" + searchId);

            if (car == null) {
                model.addAttribute("notFoundMessage", "No car found with ID " + searchId + ".");
            } else if ("vanduta".equalsIgnoreCase(car.getStare())) {
                model.addAttribute("notFoundMessage", "Car with ID " + searchId + " exists but it was already sold.");
            }

            return "car-inventory";
        }

        /* ====== 2.0) SEARCH BY VIN ====== */
        if (vinSearch != null && !vinSearch.isEmpty()) {

            List<Masina> cars = masinaDAO.findByVin(vinSearch);

            cars = sortCars(cars, sortField, sortOrder);

            model.addAttribute("cars", cars);
            model.addAttribute("vinSearch", vinSearch);
            model.addAttribute("vinNotFound", cars.isEmpty());
            model.addAttribute("currentPage", 1);
            model.addAttribute("totalPages", 1);
            model.addAttribute("pageSize", 8);
            model.addAttribute("queryString",
                    "&vinSearch=" + java.net.URLEncoder.encode(vinSearch, java.nio.charset.StandardCharsets.UTF_8));

            if (cars.isEmpty()) {
                model.addAttribute("notFoundMessage",
                        "No car found with VIN " + vinSearch + ".");
            }

            return "car-inventory";
        }

        /* ====== 2.1) SEARCH BY MODEL ====== */
        if (modelSearch != null && !modelSearch.isEmpty()) {
            List<Masina> cars = masinaDAO.findByModel(modelSearch);

            cars = sortCars(cars, sortField, sortOrder);

            model.addAttribute("cars", cars);
            model.addAttribute("modelSearch", modelSearch);
            model.addAttribute("modelNotFound", cars.isEmpty());
            model.addAttribute("currentPage", 1);
            model.addAttribute("totalPages", 1);
            model.addAttribute("pageSize", 8);
            model.addAttribute("queryString",
                    "&modelSearch=" + java.net.URLEncoder.encode(modelSearch, java.nio.charset.StandardCharsets.UTF_8));
            return "car-inventory";
        }

        /* ====== 3) FILTER CARD ====== */

        boolean hasFilters = allParams.containsKey("priceMin") ||
                allParams.containsKey("priceMax") ||
                allParams.containsKey("yearMin") ||
                allParams.containsKey("yearMax") ||
                allParams.containsKey("kmMax") ||
                allParams.containsKey("brands") ||
                allParams.containsKey("fuels") ||
                allParams.containsKey("transmissions") ||
                allParams.containsKey("doors") ||
                allParams.containsKey("seats") ||
                allParams.containsKey("providers");

        // ==== QUERY STRING BASE EMPTY ==== (pentru pagination fără filtre)
        model.addAttribute("queryString", "");

        if (hasFilters) {
            // reconstruim query string-ul pentru paginare
            StringBuilder qs = new StringBuilder();

            allParams.forEach((k, list) -> {
                if (!k.equals("page") && !k.equals("pageSize")) { // <— EXCLUDEREA CORECTĂ
                    for (String val : list) {
                        qs.append("&").append(k).append("=").append(val);
                    }
                }
            });

            model.addAttribute("queryString", qs.toString());
            model.addAttribute("filtersOpen", true);

            // ================================
            // Re-populare inputuri numerice
            // ================================
            model.addAttribute("priceMin", allParams.getFirst("priceMin"));
            model.addAttribute("priceMax", allParams.getFirst("priceMax"));
            model.addAttribute("yearMin", allParams.getFirst("yearMin"));
            model.addAttribute("yearMax", allParams.getFirst("yearMax"));
            model.addAttribute("kmMax", allParams.getFirst("kmMax"));

            // ================================
            // Re-populare checkbox-uri multiple
            // ================================
            model.addAttribute("brandsSelected",
                    allParams.containsKey("brands") ? allParams.get("brands") : null);

            model.addAttribute("providersSelected",
                    allParams.containsKey("providers") ? allParams.get("providers") : null);

            model.addAttribute("fuelsSelected",
                    allParams.containsKey("fuels") ? allParams.get("fuels") : null);

            model.addAttribute("transmissionsSelected",
                    allParams.containsKey("transmissions") ? allParams.get("transmissions") : null);

            model.addAttribute("doorsSelected",
                    allParams.containsKey("doors") ? allParams.get("doors") : null);

            model.addAttribute("seatsSelected",
                    allParams.containsKey("seats") ? allParams.get("seats") : null);

            // ================================
            // EXECUTĂM FILTRAREA COMPLETĂ
            // ================================
            List<Masina> filteredCars = masinaDAO.filterCars(allParams);
            // ================================
            // Aplicam Sortarea aleasa in pagina : default Price Ascending
            // ================================
            filteredCars = sortCars(filteredCars, sortField, sortOrder);

            model.addAttribute("filtersNotFound", filteredCars.isEmpty());

            // ================================
            // PAGINARE PE LISTA FILTRATĂ
            // ================================
            int start = (page - 1) * pageSize;
            int end = Math.min(start + pageSize, filteredCars.size());

            List<Masina> pageCars = filteredCars.subList(start, end);

            int totalPages = (int) Math.ceil(filteredCars.size() / (double) pageSize);

            model.addAttribute("cars", pageCars);
            model.addAttribute("currentPage", page);
            model.addAttribute("totalPages", totalPages);
            model.addAttribute("pageSize", pageSize);

            return "car-inventory";
        }

        /* ====== 4) PAGINATION (LISTĂ NORMALĂ FĂRĂ FILTRE) ====== */

        if (pageSize < 5)
            pageSize = 5;
        if (pageSize > 30)
            pageSize = 30;

        // Luăm TOATE mașinile disponibile (nesortate, nepaginate)
        List<Masina> carsAll = masinaDAO.findAllAvailable();

        // Aplicăm sortarea (dacă sortField e null, sortăm după price asc implicit)
        carsAll = sortCars(carsAll, sortField, sortOrder);

        // Calculăm paginarea
        int totalCars = carsAll.size();
        int totalPages = (int) Math.ceil(totalCars / (double) pageSize);

        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, totalCars);

        // Extragem DOAR mașinile paginii curente
        List<Masina> cars = carsAll.subList(start, end);

        // Trimitem în model
        model.addAttribute("cars", cars);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("pageSize", pageSize);

        return "car-inventory";

    }

    /* Helper: returnează primul element dintr-un String[] sau null */
    private String getFirst(String[] arr) {
        return (arr != null && arr.length > 0) ? arr[0] : null;
    }

    /*
     * ============================
     * FUNCTIE SORTARE UNIVERSALĂ
     * ============================
     */
    private List<Masina> sortCars(List<Masina> list, String sortField, String sortOrder) {

        if (sortField == null || sortField.isEmpty())
            return list;

        Comparator<Masina> comparator = switch (sortField) {

            case "price" -> Comparator.comparing(Masina::getPret);
            case "year" -> Comparator.comparing(Masina::getAn);
            case "km" -> Comparator.comparing(Masina::getKilometraj);
            case "brand" -> Comparator.comparing(Masina::getMarca);

            default -> null;
        };

        if (comparator == null)
            return list;

        if ("desc".equalsIgnoreCase(sortOrder)) {
            comparator = comparator.reversed();
        }

        return list.stream().sorted(comparator).toList();
    }

}
