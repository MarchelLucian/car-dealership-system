/**
 * Service pentru obținerea dinamică a logo-urilor brandurilor auto.
 * Consumă Logo.dev API, implementează caching și mapare automată branduri-domenii.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Service
public class CarLogoService {

    @Value("${LOGODEV_API_KEY:pk_cgOeSLYJQ-KDrK3Q6vlXzw}")
    private String apiKey;

    // Exact același map ca în JavaScript
    private static final Map<String, String> BRAND_DOMAIN_MAP = Map.ofEntries(
            Map.entry("Volkswagen", "vw.com"),
            Map.entry("BMW", "bmw.com"),
            Map.entry("Mercedes-Benz", "mercedes-benz.com"),
            Map.entry("Audi", "audi.com"),
            Map.entry("Porsche", "porsche.com"),
            Map.entry("Opel", "opel.com"),
            Map.entry("Skoda", "skoda-auto.com"),
            Map.entry("Toyota", "toyota.com"),
            Map.entry("Honda", "honda.com"),
            Map.entry("Nissan", "nissan-global.com"),
            Map.entry("Mazda", "mazda.com"),
            Map.entry("Subaru", "subaru.com"),
            Map.entry("Suzuki", "suzuki.com"),
            Map.entry("Mitsubishi", "mitsubishi-motors.com"),
            Map.entry("Lexus", "lexus.com"),
            Map.entry("Infiniti", "infiniti.com"),
            Map.entry("Acura", "acura.com"),
            Map.entry("Isuzu", "isuzu.co.jp"),
            Map.entry("Ford", "ford.com"),
            Map.entry("Chevrolet", "chevrolet.com"),
            Map.entry("Tesla", "tesla.com"),
            Map.entry("Dodge", "dodge.com"),
            Map.entry("Jeep", "jeep.com"),
            Map.entry("Chrysler", "chrysler.com"),
            Map.entry("Cadillac", "cadillac.com"),
            Map.entry("Buick", "buick.com"),
            Map.entry("GMC", "gmc.com"),
            Map.entry("RAM", "ramtrucks.com"),
            Map.entry("Renault", "renault.ro"),
            Map.entry("Peugeot", "peugeot.com"),
            Map.entry("Citroen", "citroen.com"),
            Map.entry("DS", "dsautomobiles.com"),
            Map.entry("Hyundai", "hyundai.com"),
            Map.entry("Kia", "kia.com"),
            Map.entry("Genesis", "genesis.com"),
            Map.entry("Land Rover", "landrover.com"),
            Map.entry("Jaguar", "jaguar.com"),
            Map.entry("Mini", "mini.com"),
            Map.entry("Fiat", "fiat.com"),
            Map.entry("Alfa Romeo", "alfaromeo.com"),
            Map.entry("Lancia", "lancia.com"),
            Map.entry("Abarth", "abarth.com"),
            Map.entry("Iveco", "iveco.com"),
            Map.entry("Seat", "seat.com"),
            Map.entry("Cupra", "cupraofficial.com"),
            Map.entry("Volvo", "volvocars.com"),
            Map.entry("Saab", "saab.com"),
            Map.entry("Dacia", "dacia.ro"),
            Map.entry("MG", "mgmotor.com"),
            Map.entry("Smart", "smart.com")
    );

    public byte[] fetchLogo(String brand) {
        try {
            // Găsește domeniul din map
            String domain = BRAND_DOMAIN_MAP.get(brand);

            if (domain == null) {
                return null; // Va returna 404, JavaScript-ul va pune default.png
            }

            // Construiește exact același URL ca în JavaScript
            String url = "https://img.logo.dev/" + domain
                    + "?token=" + apiKey
                    + "&size=128&retina=true";

            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.getForObject(url, byte[].class);

        } catch (Exception e) {
            return null;
        }
    }
}