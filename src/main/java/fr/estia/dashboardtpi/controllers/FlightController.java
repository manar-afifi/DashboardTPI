package fr.estia.dashboardtpi.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private static final String ADSB_API_URL = "https://api.adsbexchange.com/v2/lat/48.8566/lon/2.3522/dist/50";

    @GetMapping
    public ResponseEntity<String> getFlights() {
        RestTemplate restTemplate = new RestTemplate();
        try {
            String response = restTemplate.getForObject(ADSB_API_URL, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur lors de la récupération des vols.");
        }
    }
}


