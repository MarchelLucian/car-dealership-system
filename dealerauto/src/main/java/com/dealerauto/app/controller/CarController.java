package com.dealerauto.app.controller;


import com.dealerauto.app.dao.FurnizorDAO;
import com.dealerauto.app.dao.MarcaDAO;
import com.dealerauto.app.dao.MasinaDAO;
import com.dealerauto.app.dao.VinCorelareDAO;
import com.dealerauto.app.model.Agent;
import com.dealerauto.app.model.Furnizor;
import com.dealerauto.app.model.Marca;
import com.dealerauto.app.model.Masina;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Map;
@Controller
@RequestMapping("/agent-dashboard/car-inventory")
public class CarController {

    private final MasinaDAO masinaDAO;

    @Autowired
    private MarcaDAO marcaDAO;

    @Autowired
    private FurnizorDAO furnizorDAO;

    @Autowired
    private VinCorelareDAO vinCorelareDAO;

    public CarController(MasinaDAO masinaDAO) {
        this.masinaDAO = masinaDAO;
    }

    // ===== SCHIMBĂ STAREA =====
    @PostMapping("/toggle-status/{id}")
    @ResponseBody
    public String toggleStatus(@PathVariable int id) {
        masinaDAO.toggleStatus(id);
        return "OK";
    }

    // ===== FORMULAR ADĂUGARE =====
    @GetMapping("/add-car")
    public String showAddCarForm(Model model, HttpSession session) {

        Agent agent = (Agent) session.getAttribute("agent");
        model.addAttribute("agent", agent);

        model.addAttribute("masina", new Masina());
        model.addAttribute("brands", marcaDAO.getAllBrands());
        model.addAttribute("providers", furnizorDAO.getAllProviders());

        return "add-car";  // templates/add-car.html
    }

    // ===== SALVARE MAȘINĂ =====
    @PostMapping("/add-car")
    public String saveCar(
            @RequestParam(required = false) String brandName,
            @RequestParam(required = false) String providerName,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) Integer an,
            @RequestParam(required = false) Integer kilometraj,
            @RequestParam(required = false) String combustibil,
            @RequestParam(required = false) String transmisie,
            @RequestParam(required = false) String culoare,
            @RequestParam(required = false) Double pretAchizitie,
            @RequestParam(required = false) Integer usi,
            @RequestParam(required = false) Integer locuri,
            @RequestParam(required = false) String vin,
            RedirectAttributes redirectAttributes
    ) {
        // 1) VALIDARE SERVER-SIDE
        boolean invalid =
                brandName == null || brandName.isBlank() ||
                        providerName == null || providerName.isBlank() ||
                        model == null || model.isBlank() ||
                        an == null ||
                        kilometraj == null ||
                        pretAchizitie == null ||
                        usi == null ||
                        locuri == null ||
                        vin == null || vin.isBlank() ||
                        combustibil == null || combustibil.isBlank() || "Select fuel type".equals(combustibil) ||
                        transmisie == null || transmisie.isBlank() || "Select type".equals(transmisie);

        if (invalid) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "All fields are required!");
            return "redirect:/agent-dashboard/car-inventory/add-car";
        }

        // ===== VALIDARE VIN UNIC =====
        if (vinCorelareDAO.existsByVin(vin)) {

            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    "This VIN already exists in our database."
            );

            // ---- PĂSTRĂM DATELE DIN FORMULAR ----
            redirectAttributes.addFlashAttribute("brandName", brandName);
            redirectAttributes.addFlashAttribute("providerName", providerName);
            redirectAttributes.addFlashAttribute("model", model);
            redirectAttributes.addFlashAttribute("an", an);
            redirectAttributes.addFlashAttribute("kilometraj", kilometraj);
            redirectAttributes.addFlashAttribute("combustibil", combustibil);
            redirectAttributes.addFlashAttribute("transmisie", transmisie);
            redirectAttributes.addFlashAttribute("culoare", culoare);
            redirectAttributes.addFlashAttribute("pretAchizitie", pretAchizitie);
            redirectAttributes.addFlashAttribute("usi", usi);
            redirectAttributes.addFlashAttribute("locuri", locuri);

            return "redirect:/agent-dashboard/car-inventory/add-car";
        }



        // 2) TRADUCERE ENG → RO
        // convertire pentru combustibil / transmisie ENG → RO
        Map<String, String> fuelMap = Map.of(
                "petrol", "benzina",
                "diesel", "motorina",
                "electric", "electric",
                "hybrid", "hibrid"
        );
        combustibil = fuelMap.getOrDefault(combustibil, combustibil);

        Map<String, String> transMap = Map.of(
                "manual", "manuala",
                "automatic", "automata"
        );
        transmisie = transMap.getOrDefault(transmisie, transmisie);

        // creeăm obiectul
        Masina masina = new Masina();
        masina.setMarcaId(marcaDAO.findIdByName(brandName));
        masina.setFurnizorId(furnizorDAO.findIdByName(providerName));


        masina.setMarca(brandName);
        masina.setFurnizor(providerName);

        masina.setModel(model);
        masina.setAn(an);
        masina.setKilometraj(kilometraj);
        masina.setCombustibil(combustibil);
        masina.setTransmisie(transmisie);
        masina.setCuloare(culoare);
        masina.setPret(pretAchizitie);
        masina.setNumarUsi(usi);
        masina.setNumarLocuri(locuri);

        int masinaId = masinaDAO.insert(masina);

        // INSERT VIN
        if (vin != null && !vin.isBlank()) {
            vinCorelareDAO.insert(masinaId, vin);
        }


        redirectAttributes.addFlashAttribute(
                "successMessage",
                "The car has been successfully added to the inventory.<br> Add more or go inspect the inventory ."
        );

        return "redirect:/agent-dashboard/car-inventory/add-car";

    }

    @GetMapping("/add-brand")
    public String showAddBrandForm(Model model, HttpSession session) {
        model.addAttribute("brand", new Marca());
        Agent agent = (Agent) session.getAttribute("agent");
        model.addAttribute("agent", agent);
        return "add-brand";
    }


    @PostMapping("/add-brand")
    public String saveBrand(
            @RequestParam(required = false) String nume,
            @RequestParam(required = false) String tara_origine,
            RedirectAttributes redirectAttributes
    ) {
        if (nume == null || nume.isBlank() ||
                tara_origine == null || tara_origine.isBlank()) {

            redirectAttributes.addFlashAttribute("errorMessage",
                    "All fields are required!");
            return "redirect:/agent-dashboard/car-inventory/add-brand";
        }

        Marca m = new Marca();
        m.setNume(nume);
        m.setTaraOrigine(tara_origine);

        try {
            marcaDAO.insert(m);

            redirectAttributes.addFlashAttribute("successMessage",
                    "The brand has been successfully added.<br>You may add another one.");
        }
        catch (Exception e) {
            // verificăm dacă este eroare de UNICITATE
            redirectAttributes.addFlashAttribute("errorMessage",
                    "This brand already exists in the database.");

            // păstrăm datele completate de utilizator
            redirectAttributes.addFlashAttribute("nume", nume);
            redirectAttributes.addFlashAttribute("tara_origine", tara_origine);
        }

        return "redirect:/agent-dashboard/car-inventory/add-brand";
    }


    @GetMapping("/add-provider")
    public String showAddProviderPage(Model model, HttpSession session) {
        Agent agent = (Agent) session.getAttribute("agent");
        model.addAttribute("agent", agent);
        return "add-provider";
    }

    @PostMapping("/add-provider")
    public String saveProvider(
            @RequestParam String nume,
            @RequestParam String tip_furnizor,
            @RequestParam String telefon,
            @RequestParam String cui_cnp,
            @RequestParam String adresa,
            @RequestParam(required = false) String tara,
            RedirectAttributes redirectAttributes
    ) {

        if (tip_furnizor.equals("individual")) {
            tip_furnizor = "persoana fizica";
        } else if (tip_furnizor.equals("company")) {
            tip_furnizor = "firma";
        }


        Furnizor f = new Furnizor();
        f.setNume(nume);
        f.setTipFurnizor(tip_furnizor);
        f.setTelefon(telefon);
        f.setCuiCnp(cui_cnp);
        f.setAdresa(adresa);
        f.setTara(tara);


        try {
            furnizorDAO.insert(f);
        } catch (Exception e) {

            // Detectăm încălcarea constrângerilor UNIQUE
            if (e.getMessage().contains("telefon")) {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "A provider with this phone number/ CUI/ CNP already exists.");

                // păstrăm datele introduse
                redirectAttributes.addFlashAttribute("nume", nume);
                redirectAttributes.addFlashAttribute("tip_furnizor", tip_furnizor);
                redirectAttributes.addFlashAttribute("telefon", telefon);
                redirectAttributes.addFlashAttribute("cui_cnp", cui_cnp);
                redirectAttributes.addFlashAttribute("adresa", adresa);
                redirectAttributes.addFlashAttribute("tara", tara);
            }  else {
                redirectAttributes.addFlashAttribute("errorMessage",
                        "An unexpected error occurred.");
            }

            return "redirect:/agent-dashboard/car-inventory/add-provider";
        }

        redirectAttributes.addFlashAttribute("successMessage",
                "The provider has been successfully added.<br>You may add another one.");

        return "redirect:/agent-dashboard/car-inventory/add-provider";
    }

}
