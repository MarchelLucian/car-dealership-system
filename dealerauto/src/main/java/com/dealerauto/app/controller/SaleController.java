/**
 * Controller pentru pagina de vânzări a dealership-ului.
 * Centralizează toate operațiunile legate de procesul de vânzare.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.controller;

import com.dealerauto.app.dao.*;
import com.dealerauto.app.dto.SaleViewDTO;
import com.dealerauto.app.model.Agent;
import com.dealerauto.app.model.Client;
import com.dealerauto.app.model.Masina;
import com.dealerauto.app.model.Vanzare;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class SaleController {

    @GetMapping("/agent-dashboard/sales")
    public String showSalesPage(HttpSession session, Model model) {

        // Transmitem agentul către pagină (pentru Agent Badge)
        Object agent = session.getAttribute("agent");
        model.addAttribute("agent", agent);

        return "sales"; // fișierul sales.html
    }


    @GetMapping("/agent-dashboard/sales/add-sale")
    public String showAddSalePage(HttpSession session, Model model) {

        Object agent = session.getAttribute("agent");
        model.addAttribute("agent", agent);

        return "add-sale";  // fișierul add-sale.html
    }


    private final ClientRegisterDAO clientDAO;
    private final MasinaDAO masinaDAO;
    private final VanzareDAO vanzareDAO;
    private final FavoriteDAO favoriteDAO;

    //  CONSTRUCTOR INJECTION
    public SaleController(ClientRegisterDAO clientDAO,
                          MasinaDAO masinaDAO,
                          VanzareDAO vanzareDAO ,FavoriteDAO favoriteDAO ) {
        this.clientDAO = clientDAO;
        this.masinaDAO = masinaDAO;
        this.vanzareDAO = vanzareDAO;
        this.favoriteDAO = favoriteDAO;
    }

    @GetMapping("/agent-dashboard/sales/lookup-client")
    @ResponseBody
    public Map<String, Object> lookupClient(@RequestParam String cuiCnp) {
        Map<String, Object> res = new HashMap<>();

        Client c = clientDAO.findByCnpOrCui(cuiCnp); // faci funcția în DAO
        if (c == null) {
            res.put("found", false);
            res.put("message", "Client not found in the database.");
            return res;
        }

        res.put("found", true);
        res.put("id", c.getId());
        res.put("tip", c.getTip_client());       // persoana fizica / firma (sau cum ai tu)
        res.put("nume", c.getNume());     // sau nume+prenume în funcție de model
        res.put("prenume", c.getPrenume());
        res.put("telefon", c.getTelefon());
        res.put("email", c.getEmail());
        return res;
    }

    @GetMapping("/agent-dashboard/sales/lookup-car")
    @ResponseBody
    public Map<String, Object> lookupCar(@RequestParam Integer id) {
        Map<String, Object> res = new HashMap<>();

        Masina m = masinaDAO.findAvailableById(id);
        if (m == null) {
            res.put("found", false);
            res.put("message", "No registered available car with this ID.");
            return res;
        }

        // luăm VIN-ul corelat
        String vin = masinaDAO.findVinByMasinaId(m.getId());

        res.put("found", true);

        res.put("id", m.getId());
        res.put("vin", vin);

        res.put("marca", m.getMarca());
        res.put("model", m.getModel());
        res.put("an", m.getAn());
        res.put("km", m.getKilometraj());
        res.put("pretAchizitie", m.getPret()); // sau pret_achizitie
        return res;
    }

    @GetMapping("/agent-dashboard/sales/lookup-car-by-vin")
    @ResponseBody
    public Map<String, Object> lookupCarByVin(@RequestParam String vin) {

        Map<String, Object> res = new HashMap<>();

        Masina m = masinaDAO.findAvailableByVin(vin);

        if (m == null) {
            res.put("found", false);
            res.put("message", "No registered available car with this VIN.");
            return res;
        }

        res.put("found", true);

        res.put("id", m.getId());
        res.put("vin", vin);

        res.put("marca", m.getMarca());
        res.put("model", m.getModel());
        res.put("an", m.getAn());
        res.put("km", m.getKilometraj());
        res.put("pretAchizitie", m.getPret());

        return res;
    }

    @PostMapping("/agent-dashboard/sales/add-sale")
    public String addSale(
            @RequestParam Integer masina_id,
            @RequestParam Integer client_id,
            @RequestParam Double pret_final,
            @RequestParam String metoda_plata,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            java.time.LocalDate data_vanzare,
            HttpSession session,
            RedirectAttributes redirectAttributes
    ) {

        // ===== 1) Agent din sesiune =====
        Agent agent = (Agent) session.getAttribute("agent");
        if (agent == null) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage", "Session expired. Please login again."
            );
            return "redirect:/agent-login";
        }

        int agentId = agent.getId();

        // ===== 2) Preluăm preț achiziție mașină =====
        Masina masina = masinaDAO.findById(masina_id);
        if (masina == null) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage", "Invalid car selected."
            );
            return "redirect:/agent-dashboard/sales/add-sale";
        }

        double pretAchizitie = masina.getPret();


        // ===== 3) Construim obiectul Vanzare =====
        Vanzare v = new Vanzare();
        v.setMasinaId(masina_id);
        v.setClientId(client_id);
        v.setAgentId(agentId);

        // FOARTE IMPORTANT: java.sql.Date
        v.setDataVanzare(data_vanzare);

        v.setPretFinal(pret_final);
        v.setTipTranzactie(metoda_plata);
        v.setPretAchizitieMasina(pretAchizitie);
        v.setProfit(pret_final - pretAchizitie);

        // ================================
// VALIDARE DATA VÂNZARE vs STOC
// ================================
        LocalDate dataIntrareStoc = masinaDAO.findDataIntrareStocById(masina_id);

        if (dataIntrareStoc != null && data_vanzare.isBefore(dataIntrareStoc)) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    "Sale date cannot be earlier than stock entry date (" + dataIntrareStoc + ")."
            );

            // pastram valorile introduse
            redirectAttributes.addFlashAttribute("masina_id", masina_id);
            redirectAttributes.addFlashAttribute("client_id", client_id);
            redirectAttributes.addFlashAttribute("pret_final", pret_final);
            redirectAttributes.addFlashAttribute("metoda_plata", metoda_plata);

            return "redirect:/agent-dashboard/sales/add-sale";
        }


        // ===== 4) Insert Vanzare =====
        vanzareDAO.insert(v);

        // ===== 5) Schimbăm starea mașinii =====
        masinaDAO.markAsSold(masina_id);

        // ===== 6) ȘTERGE TOATE FAVORITELE PENTRU ACEASTĂ MAȘINĂ =====
        favoriteDAO.deleteByMasinaId(masina_id);

        redirectAttributes.addFlashAttribute(
                "successMessage",
                "Sale successfully registered and car marked as sold."
        );

        return "redirect:/agent-dashboard/sales/add-sale";
    }


    @GetMapping("/agent-dashboard/sales/view-my-sales")
    public String showMySales(HttpSession session, Model model) {

        Agent agent = (Agent) session.getAttribute("agent");

        //  NU e logat
        if (agent == null) {
            model.addAttribute("noAgent", true);
            return "view-my-sales";
        }

        //  agent logat
        model.addAttribute("agent", agent);

        List<SaleViewDTO> sales =
                vanzareDAO.findSalesByAgentId(agent.getId());

        model.addAttribute("sales", sales);

        return "view-my-sales";
    }

    @Autowired
    private VinCorelareDAO vinCorelareDAO;


    @GetMapping("/agent-dashboard/sales/car-info")
    @ResponseBody
    public Map<String, Object> getCarInfo(@RequestParam int carId) {

        Masina m = masinaDAO.findById(carId);
        if (m == null) {
            return Map.of("found", false);
        }

        String vin = vinCorelareDAO.findVinByMasinaId(carId); // query separat

        return Map.of(
                "found", true,
                "year", m.getAn(),
                "mileage", m.getKilometraj(),
                "transmission", m.getTransmisie().equals("automata")
                    ? "Automatic"
                    : "Manual",
                "vin", vin
        );
    }



    @GetMapping("/agent-dashboard/sales/client-info")
    @ResponseBody
    public Map<String, Object> getClientInfo(@RequestParam int clientId) {

        Client c = clientDAO.findById(clientId);
        if (c == null) {
            return Map.of("found", false);
        }

        return Map.of(
                "found", true,
                "type", c.getTip_client().equals("persoana fizica")
                        ? "Individual"
                        : "Company",
                "phone", c.getTelefon(),
                "email", c.getEmail()
        );
    }

    @GetMapping("/agent-dashboard/sales/view-my-sales/search-client")
    @ResponseBody
    public List<String> searchClients(@RequestParam String query) {
        return vanzareDAO.findDistinctClientNames(query);
    }




}
