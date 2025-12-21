package com.dealerauto.app.controller;

import com.dealerauto.app.model.Masina;
import com.dealerauto.app.dao.MasinaDAO;
import com.dealerauto.app.dao.ClientUserDAO;
import jakarta.servlet.http.HttpSession;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class ClientController {


    @Autowired
    private MasinaDAO masinaDAO;

    @Autowired
    private ClientUserDAO clientUserDAO;

    // Pagina principală /client
    @GetMapping("/client")
    public String paginaClient(
            HttpSession session,
            Model model) {

        // -------------------- NOUL COD ---------------------
        Integer clientId = (Integer) session.getAttribute("clientId");
        String clientName = (String) session.getAttribute("clientName");
        String clientSecondName = (String) session.getAttribute("clientSecondName");
        String clientInitials = (String) session.getAttribute("clientInitials");

        boolean isLogged = clientId != null;

        model.addAttribute("isLogged", isLogged);

        if (isLogged) {
            model.addAttribute("clientName", clientName); // Nume
            model.addAttribute("clientSecondName", clientSecondName); // Prenume
            model.addAttribute("clientInitials", clientInitials); // Inițiale
        }
// -----------------------------------------------------


        return "client";
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



}
