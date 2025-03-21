package fr.estia.dashboardtpi.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;

@Service
public class OpenSkyService {

    private final String BASE_URL = "https://opensky-network.org/api/states/all";

    public String getFlightsData() {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(
                BASE_URL, HttpMethod.GET, new HttpEntity<>(new HttpHeaders()), String.class);
        return response.getBody();
    }
}
