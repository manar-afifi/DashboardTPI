package fr.estia.dashboardtpi.services;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.*;

@Service
public class MetabaseService {

    private final String METABASE_URL = "http://localhost:3000";
    private final String METABASE_USERNAME = "manar.afifi@etu.estia.fr";
    private final String METABASE_PASSWORD = "Manar@@123";

    private final RestTemplate restTemplate = new RestTemplate();

    // Obtenir le token
    public String getMetabaseSessionToken() {
        String url = METABASE_URL + "/api/session";

        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", METABASE_USERNAME);
        credentials.put("password", METABASE_PASSWORD);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, credentials, Map.class);
        return (String) response.getBody().get("id");
    }
    public String getDashboardEmbedUrl(int dashboardId) {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/dashboard/" + dashboardId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);

        // Récupérer le slug (utilisé dans l’URL publique)
        String slug = (String) response.getBody().get("slug");
        return METABASE_URL + "/public/dashboard/" + dashboardId;

    }
    public List<Map<String, Object>> getAllDashboards() {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/dashboard";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
        return response.getBody();
    }
    public List<Map<String, Object>> getAllCards() {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/card";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List> response = restTemplate.exchange(url, HttpMethod.GET, entity, List.class);
        return response.getBody();
    }
    public List<Map<String, Object>> getCardsForDashboard(int dashboardId) {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/dashboard/" + dashboardId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        Map<String, Object> body = response.getBody();

        if (body == null || !body.containsKey("ordered_cards")) {
            return Collections.emptyList(); // si aucune carte, on retourne une liste vide
        }

        List<Map<String, Object>> orderedCards = (List<Map<String, Object>>) body.get("ordered_cards");

        List<Map<String, Object>> cards = new ArrayList<>();
        for (Map<String, Object> cardEntry : orderedCards) {
            Map<String, Object> card = (Map<String, Object>) cardEntry.get("card");
            if (card != null) {
                cards.add(Map.of(
                        "id", card.get("id"),
                        "name", card.get("name")
                ));
            }
        }

        return cards;
    }

    public String getCardEmbedUrl(int cardId) {
        String secretKey = "65914603f3e7c4b70b7d77934c72ccfe688fd6f7cd6168d5d87fba07cfbe547b"; // La même que dans Metabase > Settings > Embedding
        Map<String, Object> payload = new HashMap<>();
        payload.put("resource", Map.of("question", cardId));
        payload.put("params", new HashMap<>());

        String token = Jwts.builder()
                .setClaims(payload)
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes())
                .compact();

        return METABASE_URL + "/embed/question/" + token + "#bordered=true&titled=true";
    }

    public void enableEmbeddingForCard(int cardId) {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/card/" + cardId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Corps de la requête pour activer l’encastrement
        Map<String, Object> update = new HashMap<>();
        update.put("enable_embedding", true); // ✅ clé importante

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(update, headers);
        restTemplate.exchange(url, HttpMethod.PUT, request, Map.class);
    }

    public void publishCard(int cardId) {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/card/" + cardId + "/public_link";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // On appelle l'API sans payload, juste avec POST
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
    }

    public void publishAllCards() {
        List<Map<String, Object>> cards = getAllCards();

        for (Map<String, Object> card : cards) {
            int id = (Integer) card.get("id");

            try {
                enableEmbeddingForCard(id); // ✅ Étape 1 : activer l'intégration
                publishCard(id);            // ✅ Étape 2 : publier
                System.out.println("✅ Carte " + id + " publiée.");
            } catch (Exception e) {
                System.out.println("❌ Carte " + id + " erreur : " + e.getMessage());
            }
        }
    }

    // Gérer les données
    public Map<String, Object> getCardData(int cardId) {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/card/" + cardId + "/query";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

        return response.getBody();
    }
    public Map<String, Object> getCardDataWithParams(int cardId, String dateFrom, String dateTo, String granularity) {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/card/" + cardId + "/query/json";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> params = new HashMap<>();
        params.put("dateFrom", dateFrom); // ex: "2024-01-01"
        params.put("dateTo", dateTo);     // ex: "2024-12-31"
        params.put("granularity", granularity); // ex: "month"

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(params, headers);
        ResponseEntity<List> response = restTemplate.postForEntity(url, entity, List.class);

        return Map.of("data", response.getBody());
    }











    public int getPostgresDbId() {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/database";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        List<Map<String, Object>> databases = (List<Map<String, Object>>) response.getBody().get("data");

        for (Map<String, Object> db : databases) {
            if ("postgres".equalsIgnoreCase((String) db.get("engine"))) {
                return (Integer) db.get("id");
            }
        }
        throw new RuntimeException("PostgreSQL database not found in Metabase");
    }

    // Créer une carte (question) à partir d'une table PostgreSQL
    public String createQuestionFromTable(String tableName, String cardName) {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/card";

        Map<String, Object> payload = new HashMap<>();
        payload.put("name", cardName);
        payload.put("dataset_query", Map.of(
                "type", "native",
                "native", Map.of("query", "SELECT * FROM " + tableName + " LIMIT 100"),
                "database", getPostgresDbId()
        ));
        payload.put("display", "table");
        payload.put("visualization_settings", new HashMap<>());

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        return response.getBody();
    }

    // Créer un dashboard et y ajouter une carte (card)
    public String createDashboardWithCard(String dashboardName, int cardId) {
        String token = getMetabaseSessionToken();

        // 1. Créer le dashboard
        String dashboardUrl = METABASE_URL + "/api/dashboard";
        Map<String, String> dashboardPayload = Map.of("name", dashboardName);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Map> dashboardResponse = restTemplate.postForEntity(dashboardUrl, new HttpEntity<>(dashboardPayload, headers), Map.class);
        Integer dashboardId = (Integer) dashboardResponse.getBody().get("id");

        // 2. Ajouter la carte au dashboard
        String addCardUrl = METABASE_URL + "/api/dashboard/" + dashboardId + "/cards";
        Map<String, Object> oneCard = Map.of(
                "id", cardId,             // ✅ bon nom de clé
                "size_x", 4,              // ✅ bon nom de clé
                "size_y", 4,
                "col", 0,
                "row", 0
        );
        Map<String, Object> payload = Map.of("cards", List.of(oneCard));

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);
        restTemplate.exchange(addCardUrl, HttpMethod.PUT, requestEntity, String.class);

        return dashboardId.toString();
    }
}