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

    private HttpHeaders createHeaders() {
        String token = getMetabaseSessionToken();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        return headers;
    }

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
        String secretKey = "65914603f3e7c4b70b7d77934c72ccfe688fd6f7cd6168d5d87fba07cfbe547b";
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
        update.put("enable_embedding", true);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(update, headers);
        restTemplate.exchange(url, HttpMethod.PUT, request, Map.class);
    }

    public void publishCard(int cardId) {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/card/" + cardId + "/public_link";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        headers.setContentType(MediaType.APPLICATION_JSON);


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
        params.put("dateFrom", dateFrom);
        params.put("dateTo", dateTo);
        params.put("granularity", granularity);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(params, headers);
        ResponseEntity<List> response = restTemplate.postForEntity(url, entity, List.class);

        return Map.of("data", response.getBody());
    }
    public String getTableNameForCard(int cardId) {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/card/" + cardId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
        Map<String, Object> body = response.getBody();

        if (body == null || !body.containsKey("dataset_query")) {
            throw new RuntimeException("Aucune 'dataset_query' dans la réponse de la carte.");
        }

        Map<String, Object> datasetQuery = (Map<String, Object>) body.get("dataset_query");

        // Cas 1 : Requête basée sur une table (type = query builder)
        if (datasetQuery.containsKey("source-table")) {
            Object source = datasetQuery.get("source-table");

            if (source instanceof Integer) {
                return getTableNameById((Integer) source);
            }
        }

        // Cas 2 : Requête native SQL -> on essaie d’analyser la requête si possible
        if ("native".equals(datasetQuery.get("type"))) {
            Map<String, Object> nativeMap = (Map<String, Object>) datasetQuery.get("native");
            String sql = (String) nativeMap.get("query");

            // essaie de deviner la table utilisée dans un SELECT
            if (sql != null && sql.toLowerCase().contains("from")) {
                String[] parts = sql.toLowerCase().split("from");
                if (parts.length > 1) {
                    String afterFrom = parts[1].trim().split("\\s+")[0];
                    return afterFrom.replaceAll("[;]", ""); // nom de table détecté
                }
            }
        }

        throw new RuntimeException("Structure inattendue ou requête trop complexe pour la carte " + cardId);
    }

    public String getTableNameById(int tableId) {
        String url = METABASE_URL + "/api/table/" + tableId;

        HttpEntity<Void> requestEntity = new HttpEntity<>(createHeaders());

        ResponseEntity<Map> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                requestEntity,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        return body != null ? (String) body.get("name") : null;
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
                "id", cardId,
                "size_x", 4,
                "size_y", 4,
                "col", 0,
                "row", 0
        );
        Map<String, Object> payload = Map.of("cards", List.of(oneCard));

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);
        restTemplate.exchange(addCardUrl, HttpMethod.PUT, requestEntity, String.class);

        return dashboardId.toString();
    }





    public int getDashboardIdByName(String dashboardName) {
        List<Map<String, Object>> dashboards = getAllDashboards();
        for (Map<String, Object> dash : dashboards) {
            if (dashboardName.equalsIgnoreCase((String) dash.get("name"))) {
                return (Integer) dash.get("id");
            }
        }
        throw new RuntimeException("Dashboard non trouvé : " + dashboardName);
    }

    public int getCardIdByName(String cardName) {
        List<Map<String, Object>> cards = getAllCards();
        for (Map<String, Object> card : cards) {
            if (cardName.equalsIgnoreCase((String) card.get("name"))) {
                return (Integer) card.get("id");
            }
        }
        throw new RuntimeException("Carte non trouvée : " + cardName);
    }

    public void addCardToDashboardByName(String dashboardName, String cardName) {
        int dashboardId = getDashboardIdByName(dashboardName);
        int cardId = getCardIdByName(cardName);
        addCardToDashboard(dashboardId, cardId);
    }
    // méthode à corriger côté backend :
    public void addCardToDashboard(int dashboardId, int cardId) {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/dashboard/" + dashboardId + "/cards";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> card = Map.of(
                "id", cardId,
                "size_x", 4,
                "size_y", 4,
                "col", 0,
                "row", 0
        );

        Map<String, Object> payload = Map.of("cards", List.of(card));
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        restTemplate.exchange(url, HttpMethod.PUT, entity, String.class);

        // 🛠️ Active l’embed + lien public (important !)
        enableEmbeddingForCard(cardId);
        publishCard(cardId);
    }
    public void publishDashboard(int dashboardId) {
        String token = getMetabaseSessionToken();
        String url = METABASE_URL + "/api/dashboard/" + dashboardId + "/public_link";

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Metabase-Session", token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
    }







}