/*package fr.estia.dashboardtpi.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class AviationStackService {

    @Value("${aviationstack.api.key}")
    private String apiKey;

    private final String BASE_URL = "http://api.aviationstack.com/v1/";

    public String getAirlines() {
        String url = BASE_URL + "airlines?access_key=" + apiKey;
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}*/
