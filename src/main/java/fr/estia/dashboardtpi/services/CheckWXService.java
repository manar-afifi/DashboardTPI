/*package fr.estia.dashboardtpi.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class CheckWXService {

    @Value("${checkwx.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://api.checkwx.com/metar/";

    public String getWeather(String icaoCode) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-Key", apiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                BASE_URL + icaoCode + "/decoded", HttpMethod.GET, entity, String.class);
        return response.getBody();
    }
}*/
