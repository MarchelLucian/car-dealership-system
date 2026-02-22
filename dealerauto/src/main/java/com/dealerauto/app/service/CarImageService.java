/**
 * Service pentru gestionarea operațiunilor business legate de imagini mașini.
 * Folosește Pexels API (gratuit, cheie pe https://www.pexels.com/api/).
 * Alternative gratuite: Unsplash API (unsplash.com/developers), sau pentru imagini
 * auto specifice: CarsXE / GetCarImages (triale gratuite, apoi plată).
 */
package com.dealerauto.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

@Service
public class CarImageService {

    @Value("${PEXELS_API_KEY:n7ehKn42oBcP3W1pVxdnvOKWkiKbKq4Rbn0G7wRXBgSsCFdQmMjT8yCB}")
    private String pexelsApiKey;

    private static final String PEXELS_API_URL = "https://api.pexels.com/v1/search";

    public List<String> fetchCarImages(String brand, String model) {
        try {
            // Construiește query-ul de căutare
            String query = brand + " " + model + " car";
            String url = PEXELS_API_URL + "?query=" + query.replace(" ", "+") + "&per_page=6";

            // Setează header-ul cu API key
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", pexelsApiKey);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Face request
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            // Parse JSON response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            JsonNode photos = root.get("photos");

            List<String> imageUrls = new ArrayList<>();

            if (photos != null && photos.isArray()) {
                for (JsonNode photo : photos) {
                    // Folosește imaginea medie (landscape)
                    String imageUrl = photo.get("src").get("large").asText();
                    imageUrls.add(imageUrl);
                }
            }

            // Dacă nu găsește imagini cu brand + model, caută doar brandul
            if (imageUrls.isEmpty()) {
                return fetchCarImages(brand, ""); // Fallback la doar brand
            }

            return imageUrls;

        } catch (Exception e) {
            // Return listă goală în caz de eroare
            return new ArrayList<>();
        }
    }
}