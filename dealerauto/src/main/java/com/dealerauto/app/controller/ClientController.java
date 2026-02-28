/**
 * Controller for the public client catalog.
 * Handles listing of available cars with filters and sorting.
 *
 * @author Marchel Lucian
 * @version 12 January 2026
 */
package com.dealerauto.app.controller;

import com.dealerauto.app.dao.PretVanzareDAO;
import com.dealerauto.app.model.*;
import com.dealerauto.app.dao.MasinaDAO;
import com.dealerauto.app.dao.ClientUserDAO;
import com.dealerauto.app.service.ClientService;
import com.dealerauto.app.service.ClientUserService;
import com.dealerauto.app.service.FavoriteService;
import com.dealerauto.app.service.OrderService;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class ClientController {

    @Autowired
    private MasinaDAO masinaDAO;

    @Autowired
    private ClientUserDAO clientUserDAO;

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private ClientService clientService; //

    @Autowired
    private ClientUserService clientUserService; //

    @Autowired
    private PretVanzareDAO pretVanzareDAO;

    @Autowired
    private OrderService orderService;

    // Pagina principală /client
    @GetMapping("/client")
    public String paginaClient(HttpSession session, Model model) {
        Integer clientId = (Integer) session.getAttribute("clientId");
        String clientName = (String) session.getAttribute("clientName");
        String clientSecondName = (String) session.getAttribute("clientSecondName");
        String clientInitials = (String) session.getAttribute("clientInitials");

        boolean isLogged = clientId != null;
        model.addAttribute("isLogged", isLogged);

        // Preia datele de actualizare (UN singur query)
        Map<Integer, LocalDateTime> dateActualizare = masinaDAO.findAllActualDates();

        model.addAttribute("dateActualizare", dateActualizare);

        if (isLogged) {
            model.addAttribute("clientName", clientName);
            model.addAttribute("clientSecondName", clientSecondName);
            model.addAttribute("clientInitials", clientInitials);

            // Adaugă ID-urile mașinilor favorite
            Set<Integer> favoriteMasinaIds = favoriteService.getFavoriteMasinaIds(clientId);
            model.addAttribute("favoriteMasinaIds", favoriteMasinaIds);
        } else {
            model.addAttribute("favoriteMasinaIds", Collections.emptySet());
        }

        return "client";
    }

    // API: Toggle favorite (AJAX endpoint)
    @PostMapping("/api/favorite/toggle")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> toggleFavorite(
            @RequestParam Integer masinaId,
            HttpSession session) {

        Integer clientId = (Integer) session.getAttribute("clientId");

        if (clientId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }

        try {
            boolean isAdded = favoriteService.toggleFavorite(clientId, masinaId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isAdded", isAdded);
            response.put("message", isAdded ? "Added to favorites" : "Removed from favorites");

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint pentru debugging - verifică sesiunea
    @GetMapping("/api/check-session")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkSession(HttpSession session) {
        Integer clientId = (Integer) session.getAttribute("clientId");
        String clientName = (String) session.getAttribute("clientName");

        Map<String, Object> sessionData = new HashMap<>();
        sessionData.put("clientId", clientId);
        sessionData.put("clientName", clientName);
        sessionData.put("isLogged", clientId != null);

        return ResponseEntity.ok(sessionData);
    }

    @GetMapping("/client/all")
    @ResponseBody
    public List<Masina> getAllMasini() {
        return masinaDAO.getAllDisponibile();
    }

    @GetMapping("/client/brands")
    @ResponseBody
    public List<String> getBrands() {
        return masinaDAO.getAllBrands();
    }

    // Pagina de favorites
    @GetMapping("/client/favorites")
    public String paginaFavorites(HttpSession session, Model model) {
        Integer clientId = (Integer) session.getAttribute("clientId");

        // Verifică dacă user-ul este logat
        if (clientId == null) {
            return "redirect:/client-login";
        }

        String clientName = (String) session.getAttribute("clientName");
        String clientSecondName = (String) session.getAttribute("clientSecondName");
        String clientInitials = (String) session.getAttribute("clientInitials");

        model.addAttribute("isLogged", true);
        model.addAttribute("clientName", clientName);
        model.addAttribute("clientSecondName", clientSecondName);
        model.addAttribute("clientInitials", clientInitials);

        // Preia mașinile favorite
        List<Masina> favoriteMasini = favoriteService.getFavoriteMasini(clientId);
        model.addAttribute("masini", favoriteMasini);

        // ID-urile favorite (toate vor fi active pe această pagină)
        Set<Integer> favoriteMasinaIds = favoriteService.getFavoriteMasinaIds(clientId);
        model.addAttribute("favoriteMasinaIds", favoriteMasinaIds);

        // Preia mașinile favorite CU data_adaugare
        List<Favorite> favorites = favoriteService.getFavoritesByClientId(clientId);

        // Creează un Map pentru acces rapid la data_adaugare
        Map<Integer, LocalDateTime> favoriteDates = favorites.stream()
                .collect(Collectors.toMap(Favorite::getMasinaId, Favorite::getDataAdaugare));

        model.addAttribute("favoriteDates", favoriteDates);

        // Preia datele de actualizare a prețurilor
        Map<Integer, LocalDateTime> dateActualizare = new HashMap<>();
        for (Masina m : favoriteMasini) {
            PretVanzare pretVanzare = pretVanzareDAO.findByMasinaId(m.getId());
            if (pretVanzare != null && pretVanzare.getDataActualizare() != null) {
                dateActualizare.put(m.getId(), pretVanzare.getDataActualizare());
            }
        }
        model.addAttribute("dateActualizare", dateActualizare);

        return "favorites"; // favorites.html
    }

    // Pagina My Account
    @GetMapping("/client/my-account")
    public String paginaMyAccount(HttpSession session, Model model) {
        Integer clientId = (Integer) session.getAttribute("clientId");

        if (clientId == null) {
            return "redirect:/client-login";
        }

        String clientName = (String) session.getAttribute("clientName");
        String clientSecondName = (String) session.getAttribute("clientSecondName");
        String clientInitials = (String) session.getAttribute("clientInitials");

        model.addAttribute("isLogged", true);
        model.addAttribute("clientName", clientName);
        model.addAttribute("clientSecondName", clientSecondName);
        model.addAttribute("clientInitials", clientInitials);

        // Preia informațiile complete ale clientului din tabela client
        Client client = clientService.getClientById(clientId);

        if (client != null) {
            model.addAttribute("client", client);

            // Traduce tipul clientului
            String clientTypeEnglish = clientService.translateClientType(client.getTip_client());
            model.addAttribute("clientTypeEnglish", clientTypeEnglish);
        }

        return "my-account"; // my-account.html
    }

    // API: Change Password
    @PostMapping("/api/client/my-account/change-password")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> changePassword(
            @RequestParam String currentPassword,
            @RequestParam String newPassword,
            HttpSession session) {

        Integer clientId = (Integer) session.getAttribute("clientId");

        if (clientId == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Not logged in"));
        }

        try {
            // Verifică parola curentă
            ClientUser clientUser = clientUserService.findByClientId(clientId);

            if (clientUser == null) {
                return ResponseEntity.status(404).body(Map.of("success", false, "message", "User not found"));
            }

            // Verifică dacă parola curentă este corectă
            if (!clientUser.getPassword().equals(currentPassword)) {
                return ResponseEntity.ok(Map.of("success", false, "message", "Current password is incorrect"));
            }

            // Actualizează parola
            clientUserService.updatePassword(clientId, newPassword);

            return ResponseEntity.ok(Map.of("success", true, "message", "Password changed successfully"));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "An error occurred"));
        }
    }

    // Pagina My Orders
    @GetMapping("/client/my-orders")
    public String paginaMyOrders(HttpSession session, Model model) {
        Integer clientId = (Integer) session.getAttribute("clientId");

        if (clientId == null) {
            return "redirect:/client-login";
        }

        String clientName = (String) session.getAttribute("clientName");
        String clientSecondName = (String) session.getAttribute("clientSecondName");
        String clientInitials = (String) session.getAttribute("clientInitials");

        model.addAttribute("isLogged", true);
        model.addAttribute("clientName", clientName);
        model.addAttribute("clientSecondName", clientSecondName);
        model.addAttribute("clientInitials", clientInitials);

        // Preia comenzile (orders)
        List<OrderDetails> orders = orderService.getClientOrders(clientId);
        model.addAttribute("orders", orders);

        // Total valoare achiziții (suma pretFinal)
        long totalPurchasesAmount = orders.stream()
                .mapToLong(o -> o.getVanzare() != null && o.getVanzare().getPretFinal() != null
                        ? o.getVanzare().getPretFinal().longValue()
                        : 0L)
                .sum();
        model.addAttribute("totalPurchasesAmount", totalPurchasesAmount);

        return "my-orders"; // my-orders.html
    }

}
