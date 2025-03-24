package fr.estia.dashboardtpi.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.estia.dashboardtpi.services.MetabaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metabase")
@RequiredArgsConstructor
public class MetabaseController {

    private final MetabaseService metabaseService;

    @PostMapping("/generate-dashboard")
    public ResponseEntity<String> generateDashboard(
            @RequestParam String tableName,
            @RequestParam String dashboardName,
            @RequestParam String cardName) {

        try {
            // 1. Créer une carte (question)
            String cardResponse = metabaseService.createQuestionFromTable(tableName, cardName);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(cardResponse);
            int cardId = json.get("id").asInt();

            // 2. Créer un dashboard avec la carte
            String dashboardId = metabaseService.createDashboardWithCard(dashboardName, cardId);

            return ResponseEntity.ok("✅ Dashboard créé avec l'ID : " + dashboardId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("❌ Erreur : " + e.getMessage());
        }
    }
    @GetMapping("/dashboard-url/{id}")
    public ResponseEntity<String> getDashboardUrl(@PathVariable int id) {
        try {
            String url = metabaseService.getDashboardEmbedUrl(id);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur récupération URL : " + e.getMessage());
        }
    }
    @GetMapping("/list-dashboards")
    public ResponseEntity<List<Map<String, Object>>> listDashboards() {
        return ResponseEntity.ok(metabaseService.getAllDashboards());
    }
    @GetMapping("/dashboards")
    public ResponseEntity<List<Map<String, Object>>> getDashboards() {
        return ResponseEntity.ok(metabaseService.getAllDashboards());
    }/*
    @GetMapping("/dashboard-cards/{id}")
    public ResponseEntity<List<Map<String, Object>>> getCards(@PathVariable int id) {
        return ResponseEntity.ok(metabaseService.getCardsForDashboard(id));
    }
    @GetMapping("/cards")
    public ResponseEntity<List<Map<String, Object>>> getAllCards() {
        return ResponseEntity.ok(metabaseService.getAllCards());
    }*/
    @GetMapping("/cards")
    public ResponseEntity<List<Map<String, Object>>> getAllCards() {
        return ResponseEntity.ok(metabaseService.getAllCards());
    }
    @GetMapping("/dashboard-cards/{id}")
    public ResponseEntity<List<Map<String, Object>>> getCards(@PathVariable int id) {
        return ResponseEntity.ok(metabaseService.getCardsForDashboard(id));
    }
    @GetMapping("/card-url/{id}")
    public ResponseEntity<String> getCardUrl(@PathVariable int id) {
        String url = metabaseService.getCardEmbedUrl(id);
        return ResponseEntity.ok(url);
    }
    @PutMapping("/cards/{id}/enable-embed")
    public ResponseEntity<String> enableEmbedding(@PathVariable int id) {
        try {
            metabaseService.enableEmbeddingForCard(id);
            return ResponseEntity.ok("✅ Embedding activé pour la carte " + id);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Erreur : " + e.getMessage());
        }
    }
    @PostMapping("/publish-all-cards")
    public ResponseEntity<String> publishAllCards() {
        metabaseService.publishAllCards();
        return ResponseEntity.ok("✅ Toutes les cartes ont été publiées (ou l’étaient déjà).");
    }

    @GetMapping("/card-data/{id}")
    public ResponseEntity<Map<String, Object>> getCardData(@PathVariable int id) {
        return ResponseEntity.ok(metabaseService.getCardData(id));
    }
    @GetMapping("/card-data/{id}/filtered")
    public ResponseEntity<Map<String, Object>> getCardDataFiltered(
            @PathVariable int id,
            @RequestParam String dateFrom,
            @RequestParam String dateTo,
            @RequestParam(defaultValue = "month") String granularity) {

        return ResponseEntity.ok(metabaseService.getCardDataWithParams(id, dateFrom, dateTo, granularity));
    }
















}