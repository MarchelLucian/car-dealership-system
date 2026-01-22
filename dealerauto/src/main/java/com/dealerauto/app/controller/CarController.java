/**
 * Controller pentru gestionarea operațiunilor generale pe mașini.
 * Coordonează logica de afișare și manipulare a stocului de vehicule.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.controller;


import com.dealerauto.app.dao.*;
import com.dealerauto.app.model.Agent;
import com.dealerauto.app.model.Furnizor;
import com.dealerauto.app.model.Marca;
import com.dealerauto.app.model.Masina;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
@Controller
@RequestMapping("/agent-dashboard/cars-management")
public class CarController {

    private final MasinaDAO masinaDAO;
    private final MarcaDAO marcaDAO;
    private final FurnizorDAO furnizorDAO;
    private final VinCorelareDAO vinCorelareDAO;
    private final MasiniRetraseDAO masiniRetraseDAO;

    public CarController(
            MasinaDAO masinaDAO,
            MarcaDAO marcaDAO,
            FurnizorDAO furnizorDAO,
            VinCorelareDAO vinCorelareDAO,
            MasiniRetraseDAO masiniRetraseDAO
    ) {
        this.masinaDAO = masinaDAO;
        this.marcaDAO = marcaDAO;
        this.furnizorDAO = furnizorDAO;
        this.vinCorelareDAO = vinCorelareDAO;
        this.masiniRetraseDAO = masiniRetraseDAO;
    }

    // ===== SCHIMBĂ STAREA =====
    @PostMapping("/car-inventory/toggle-status/{id}")
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
        model.addAttribute("brands", marcaDAO.getAllBrands()); // face rost de toate brandurile din baza de date
        model.addAttribute("providers", furnizorDAO.getAllProviders()); // toti providerii inregistrati

        return "add-car";  // templates/add-car.html
    }

    @Autowired
    private MarcaFurnizorDAO marcaFurnizorDAO;

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
            @RequestParam(required = false) Double pretVanzare,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate dataIntrare,
            RedirectAttributes redirectAttributes
    ) {
        if (an != null && an <= 1950) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    "Year must be greater than 1950."
            );

            redirectAttributes.addFlashAttribute("brandName", brandName);
            redirectAttributes.addFlashAttribute("providerName", providerName);
            redirectAttributes.addFlashAttribute("model", model);
            redirectAttributes.addFlashAttribute("an", an);
            redirectAttributes.addFlashAttribute("kilometraj", kilometraj);
            redirectAttributes.addFlashAttribute("combustibil", combustibil);
            redirectAttributes.addFlashAttribute("transmisie", transmisie);
            redirectAttributes.addFlashAttribute("culoare", culoare);
            redirectAttributes.addFlashAttribute("pretAchizitie", pretAchizitie);
            redirectAttributes.addFlashAttribute("pretVanzare", pretVanzare);
            redirectAttributes.addFlashAttribute("usi", usi);
            redirectAttributes.addFlashAttribute("locuri", locuri);
            redirectAttributes.addFlashAttribute("vin", vin);
            redirectAttributes.addFlashAttribute("dataIntrare", dataIntrare);

            return "redirect:/agent-dashboard/cars-management/add-car";
        }

        if ( kilometraj < 0) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    "Mileage must be zero or a positive number."
            );

            redirectAttributes.addFlashAttribute("brandName", brandName);
            redirectAttributes.addFlashAttribute("providerName", providerName);
            redirectAttributes.addFlashAttribute("model", model);
            redirectAttributes.addFlashAttribute("an", an);
            redirectAttributes.addFlashAttribute("kilometraj", kilometraj);
            redirectAttributes.addFlashAttribute("combustibil", combustibil);
            redirectAttributes.addFlashAttribute("transmisie", transmisie);
            redirectAttributes.addFlashAttribute("culoare", culoare);
            redirectAttributes.addFlashAttribute("pretAchizitie", pretAchizitie);
            redirectAttributes.addFlashAttribute("pretVanzare", pretVanzare);
            redirectAttributes.addFlashAttribute("usi", usi);
            redirectAttributes.addFlashAttribute("locuri", locuri);
            redirectAttributes.addFlashAttribute("vin", vin);
            redirectAttributes.addFlashAttribute("dataIntrare", dataIntrare);

            return "redirect:/agent-dashboard/cars-management/add-car";
        }

        if (pretAchizitie <= 0) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    "Purchase price must be greater than 0."
            );

            redirectAttributes.addFlashAttribute("brandName", brandName);
            redirectAttributes.addFlashAttribute("providerName", providerName);
            redirectAttributes.addFlashAttribute("model", model);
            redirectAttributes.addFlashAttribute("an", an);
            redirectAttributes.addFlashAttribute("kilometraj", kilometraj);
            redirectAttributes.addFlashAttribute("combustibil", combustibil);
            redirectAttributes.addFlashAttribute("transmisie", transmisie);
            redirectAttributes.addFlashAttribute("culoare", culoare);
            redirectAttributes.addFlashAttribute("pretAchizitie", pretAchizitie);
            redirectAttributes.addFlashAttribute("pretVanzare", pretVanzare);
            redirectAttributes.addFlashAttribute("usi", usi);
            redirectAttributes.addFlashAttribute("locuri", locuri);
            redirectAttributes.addFlashAttribute("vin", vin);
            redirectAttributes.addFlashAttribute("dataIntrare", dataIntrare);

            return "redirect:/agent-dashboard/cars-management/add-car";
        }

        if ( pretVanzare < pretAchizitie) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    "Selling price must be greater than or equal to purchase price."
            );

            redirectAttributes.addFlashAttribute("brandName", brandName);
            redirectAttributes.addFlashAttribute("providerName", providerName);
            redirectAttributes.addFlashAttribute("model", model);
            redirectAttributes.addFlashAttribute("an", an);
            redirectAttributes.addFlashAttribute("kilometraj", kilometraj);
            redirectAttributes.addFlashAttribute("combustibil", combustibil);
            redirectAttributes.addFlashAttribute("transmisie", transmisie);
            redirectAttributes.addFlashAttribute("culoare", culoare);
            redirectAttributes.addFlashAttribute("pretAchizitie", pretAchizitie);
            redirectAttributes.addFlashAttribute("pretVanzare", pretVanzare);
            redirectAttributes.addFlashAttribute("usi", usi);
            redirectAttributes.addFlashAttribute("locuri", locuri);
            redirectAttributes.addFlashAttribute("vin", vin);
            redirectAttributes.addFlashAttribute("dataIntrare", dataIntrare);

            return "redirect:/agent-dashboard/cars-management/add-car";
        }

        if ( usi < 1 || usi > 10 ) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    "Number of doors must be between 1 and 10."
            );

            redirectAttributes.addFlashAttribute("brandName", brandName);
            redirectAttributes.addFlashAttribute("providerName", providerName);
            redirectAttributes.addFlashAttribute("model", model);
            redirectAttributes.addFlashAttribute("an", an);
            redirectAttributes.addFlashAttribute("kilometraj", kilometraj);
            redirectAttributes.addFlashAttribute("combustibil", combustibil);
            redirectAttributes.addFlashAttribute("transmisie", transmisie);
            redirectAttributes.addFlashAttribute("culoare", culoare);
            redirectAttributes.addFlashAttribute("pretAchizitie", pretAchizitie);
            redirectAttributes.addFlashAttribute("pretVanzare", pretVanzare);
            redirectAttributes.addFlashAttribute("usi", usi);
            redirectAttributes.addFlashAttribute("locuri", locuri);
            redirectAttributes.addFlashAttribute("vin", vin);
            redirectAttributes.addFlashAttribute("dataIntrare", dataIntrare);

            return "redirect:/agent-dashboard/cars-management/add-car";
        }

        if ( locuri < 1 || locuri > 40 ) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    "Number of seats must be between 1 and 40."
            );

            redirectAttributes.addFlashAttribute("brandName", brandName);
            redirectAttributes.addFlashAttribute("providerName", providerName);
            redirectAttributes.addFlashAttribute("model", model);
            redirectAttributes.addFlashAttribute("an", an);
            redirectAttributes.addFlashAttribute("kilometraj", kilometraj);
            redirectAttributes.addFlashAttribute("combustibil", combustibil);
            redirectAttributes.addFlashAttribute("transmisie", transmisie);
            redirectAttributes.addFlashAttribute("culoare", culoare);
            redirectAttributes.addFlashAttribute("pretAchizitie", pretAchizitie);
            redirectAttributes.addFlashAttribute("pretVanzare", pretVanzare);
            redirectAttributes.addFlashAttribute("usi", usi);
            redirectAttributes.addFlashAttribute("locuri", locuri);
            redirectAttributes.addFlashAttribute("vin", vin);
            redirectAttributes.addFlashAttribute("dataIntrare", dataIntrare);

            return "redirect:/agent-dashboard/cars-management/add-car";
        }

        // =====================
        // VALIDARE DATA INTRARE STOC >= 01.01.2020
        // =====================
        LocalDate minDate = LocalDate.of(2020, 1, 1);

        if (dataIntrare != null && dataIntrare.isBefore(minDate)) {

            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    "Stock entry date must be after 01.01.2020."
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
            redirectAttributes.addFlashAttribute("pretVanzare", pretVanzare);
            redirectAttributes.addFlashAttribute("usi", usi);
            redirectAttributes.addFlashAttribute("locuri", locuri);
            redirectAttributes.addFlashAttribute("vin", vin);
            redirectAttributes.addFlashAttribute("dataIntrare", dataIntrare);

            return "redirect:/agent-dashboard/cars-management/add-car";
        }

        // 1) VALIDARE SERVER-SIDE
        boolean invalid =
                brandName == null || brandName.isBlank() ||
                        providerName == null || providerName.isBlank() ||
                        model == null || model.isBlank() ||
                        an == null ||
                        kilometraj == null ||
                        pretAchizitie == null ||
                        pretVanzare == null || pretVanzare <= 0 ||
                        usi == null ||
                        locuri == null ||
                        vin == null || vin.isBlank() ||
                        combustibil == null || combustibil.isBlank() || "Select fuel type".equals(combustibil) ||
                        transmisie == null || transmisie.isBlank() || "Select type".equals(transmisie);

        if (invalid) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "All fields are required!");
            return "redirect:/agent-dashboard/cars-management/add-car";
        }

        // =====================
        // FALLBACK DATA INTRARE STOC
        // =====================
        if (dataIntrare == null) {
            dataIntrare = LocalDate.now();
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
            redirectAttributes.addFlashAttribute("dataIntrare", dataIntrare);

            return "redirect:/agent-dashboard/cars-management/add-car";
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
        masina.setDataIntrareStoc(dataIntrare);


        int masinaId = masinaDAO.insert(masina);

        masinaDAO.upsertPretVanzare(masinaId, pretVanzare);

        // INSERT VIN
        if (vin != null && !vin.isBlank()) {
            vinCorelareDAO.insert(masinaId, vin);
        }


        //  INSERT în marcafurnizor , daca nu exista
        marcaFurnizorDAO.insertIfNotExists(
                masina.getMarcaId(),
                masina.getFurnizorId()
        );

        redirectAttributes.addFlashAttribute(
                "successMessage",
                "The car has been successfully added to the inventory.<br> Add more or go inspect the inventory ."
        );

        return "redirect:/agent-dashboard/cars-management/add-car";

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
            return "redirect:/agent-dashboard/cars-management/add-brand";
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

        return "redirect:/agent-dashboard/cars-management/add-brand";
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

            return "redirect:/agent-dashboard/cars-management/add-provider";
        }

        redirectAttributes.addFlashAttribute("successMessage",
                "The provider has been successfully added.<br>You may add another one.");

        return "redirect:/agent-dashboard/cars-management/add-provider";
    }


    @GetMapping("/retract-car")
    public String showRetractCarPage(Model model , HttpSession session) {
        Agent agent = (Agent) session.getAttribute("agent");
        model.addAttribute("agent", agent);
        return "retract-car";
    }

    @GetMapping("/lookup-car-with-provider")
    @ResponseBody
    public Map<String, Object> lookupCarWithProvider(@RequestParam int id) {

        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> row = masinaDAO.findCarWithProviderById(id);

            response.put("found", true);

            // CAR
            response.put("id", row.get("masina_id"));
            response.put("vin", row.get("vin"));
            response.put("marca", row.get("marca"));
            response.put("model", row.get("model"));
            response.put("an", row.get("an"));
            response.put("km", row.get("km"));
            response.put("pretAchizitie", row.get("pret_achizitie"));
            response.put("combustibil", row.get("combustibil"));
            response.put("transmisie", row.get("transmisie"));
            response.put("numar_locuri", row.get("numar_locuri"));
            response.put("data_intrare_stoc", row.get("data_intrare_stoc"));


            // PROVIDER
            response.put("provider_id", row.get("provider_id"));
            response.put("provider_nume", row.get("provider_nume"));
            response.put("provider_tip", row.get("provider_tip"));
            response.put("provider_telefon", row.get("provider_telefon"));
            response.put("provider_cui_cnp", row.get("provider_cui_cnp"));

            return response;

        } catch (EmptyResultDataAccessException e) {
            response.put("found", false);
            response.put("message", "Car not found.");
            return response;
        }
    }

    @GetMapping("/lookup-car-with-provider-by-vin")
    @ResponseBody
    public Map<String, Object> lookupCarWithProviderByVin(@RequestParam String vin) {

        Map<String, Object> res = new HashMap<>();

        try {
            Map<String, Object> row = masinaDAO.findCarWithProviderByVin(vin);

            res.put("found", true);

            // CAR
            res.put("id", row.get("masina_id"));
            res.put("vin", row.get("vin"));
            res.put("marca", row.get("marca"));
            res.put("model", row.get("model"));
            res.put("an", row.get("an"));
            res.put("km", row.get("km"));
            res.put("pretAchizitie", row.get("pret_achizitie"));
            res.put("combustibil", row.get("combustibil"));
            res.put("transmisie", row.get("transmisie"));
            res.put("numar_locuri", row.get("numar_locuri"));
            res.put("data_intrare_stoc", row.get("data_intrare_stoc"));


            // PROVIDER
            res.put("provider_id", row.get("provider_id"));
            res.put("provider_nume", row.get("provider_nume"));
            res.put("provider_tip", row.get("provider_tip"));
            res.put("provider_telefon", row.get("provider_telefon"));
            res.put("provider_cui_cnp", row.get("provider_cui_cnp"));

            return res;

        } catch (EmptyResultDataAccessException e) {
            res.put("found", false);
            res.put("message", "Car not found.");
            return res;
        }
    }

    @PostMapping("/retract-car")
    @Transactional
    public String retractCar(
            @RequestParam int masina_id,
            @RequestParam String vin,
            @RequestParam String marca_nume,
            @RequestParam String model,
            @RequestParam int an_fabricatie,
            @RequestParam int kilometraj,
            @RequestParam double pret_achizitie,
            @RequestParam String combustibil,
            @RequestParam String transmisie,
            @RequestParam int numar_locuri,
            @RequestParam int provider_id,
            @RequestParam String provider_nume,
            @RequestParam(name = "retract_reason") String motiv,
            @RequestParam(required = false) Integer zile_in_stoc,
            @RequestParam(required = false)double taxaStationare,
            RedirectAttributes redirectAttributes
    ) {

        try {
            if (zile_in_stoc == null) {
                zile_in_stoc = 0;
            }

            masiniRetraseDAO.insert(
                    vin,
                    marca_nume,
                    model,
                    an_fabricatie,
                    kilometraj,
                    pret_achizitie,
                    combustibil,
                    transmisie,
                    numar_locuri,
                    provider_id,
                    provider_nume,
                    motiv,
                    zile_in_stoc,
                    taxaStationare
            );

            vinCorelareDAO.deleteByMasinaId(masina_id);
            masinaDAO.deleteById(masina_id);

            redirectAttributes.addFlashAttribute(
                    "successMessage",
                    "Car successfully withdrawn from inventory."
            );

        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute(
                    "errorMessage",
                    "An error occurred while withdrawing the car. Please try again."
            );
        }

        return "redirect:/agent-dashboard/cars-management/retract-car";
    }


    @GetMapping("/edit-listings")
    public String showEditListiongsPage(Model model , HttpSession session) {
        Agent agent = (Agent) session.getAttribute("agent");
        model.addAttribute("agent", agent);
        return "edit-listings";
    }

    @GetMapping("/lookup-car-for-listing")
    @ResponseBody
    public Map<String, Object> lookupCarForListing(@RequestParam int id) {

        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> row = masinaDAO.findCarForListingById(id);

            response.put("found", true);

            // IDENTIFICARE
            response.put("id", row.get("masina_id"));
            response.put("vin", row.get("vin"));

            // VEHICLE INFO
            response.put("marca", row.get("marca"));
            response.put("model", row.get("model"));
            response.put("an", row.get("an"));
            response.put("km", row.get("km"));
            response.put("combustibil", row.get("combustibil"));
            response.put("transmisie", row.get("transmisie"));
            response.put("culoare", row.get("culoare"));
            response.put("numar_locuri", row.get("numar_locuri"));

            // PRICES
            response.put("pretAchizitie", row.get("pret_achizitie"));
            response.put("pretVanzare", row.get("pret_vanzare"));

            return response;

        } catch (EmptyResultDataAccessException e) {
            response.put("found", false);
            response.put("message", "Car not found.");
            return response;
        }
    }


    @GetMapping("/lookup-car-for-listing-by-vin")
    @ResponseBody
    public Map<String, Object> lookupCarForListingByVin(@RequestParam String vin) {

        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> row = masinaDAO.findCarForListingByVin(vin);

            response.put("found", true);

            // IDENTIFICARE
            response.put("id", row.get("masina_id"));
            response.put("vin", row.get("vin"));

            // VEHICLE INFO
            response.put("marca", row.get("marca"));
            response.put("model", row.get("model"));
            response.put("an", row.get("an"));
            response.put("km", row.get("km"));
            response.put("combustibil", row.get("combustibil"));
            response.put("transmisie", row.get("transmisie"));
            response.put("culoare", row.get("culoare"));
            response.put("numar_locuri", row.get("numar_locuri"));

            // PRICES
            response.put("pretAchizitie", row.get("pret_achizitie"));
            response.put("pretVanzare", row.get("pret_vanzare"));

            return response;

        } catch (EmptyResultDataAccessException e) {
            response.put("found", false);
            response.put("message", "Car not found.");
            return response;
        }
    }

    @PostMapping("/edit-listings/update-price")
    @Transactional
    public String updateListingPrice(
            @RequestParam("masina_id") int masinaId,
            @RequestParam("pret_vanzare_nou") double pretVanzareNou,
            RedirectAttributes redirectAttributes
    ) {
        try {

            if (pretVanzareNou <= 0) {
                redirectAttributes.addFlashAttribute("errorMessage", "New selling price must be greater than 0.");
                return "redirect:/agent-dashboard/cars-management/edit-listings";
            }

            int updated = masinaDAO.updatePretVanzare(masinaId, pretVanzareNou);

            if (updated == 0) {
                redirectAttributes.addFlashAttribute("errorMessage", "Price update failed. Car price row not found.");
                return "redirect:/agent-dashboard/cars-management/edit-listings";
            }

            redirectAttributes.addFlashAttribute("successMessage", "Selling price updated successfully.");

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "An error occurred while updating the price.");
        }

        return "redirect:/agent-dashboard/cars-management/edit-listings";
    }


}
