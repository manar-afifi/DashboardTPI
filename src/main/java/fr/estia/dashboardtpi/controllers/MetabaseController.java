package fr.estia.dashboardtpi.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.estia.dashboardtpi.services.MetabaseService;
import fr.estia.dashboardtpi.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metabase")
@RequiredArgsConstructor
public class MetabaseController {

    private final MetabaseService metabaseService;
    private final NotificationService notificationService;


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

    @GetMapping("/card-table-name/{id}")
    public ResponseEntity<String> getTableNameFromCard(@PathVariable int id) {
        try {
            String tableName = metabaseService.getTableNameForCard(id);
            return ResponseEntity.ok(tableName);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("❌ Erreur : " + e.getMessage());
        }
    }
    @PostMapping("/add-existing-card-by-name")
    public ResponseEntity<String> addExistingCardToDashboard(
            @RequestParam String dashboardName,
            @RequestParam String cardName) {

        try {
            // Ajoute la carte par noms
            metabaseService.addCardToDashboardByName(dashboardName, cardName);

            return ResponseEntity.ok("✅ Carte ajoutée avec succès à " + dashboardName);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("❌ Erreur : " + e.getMessage());
        }
    }


/*
    @PostMapping("/notify-new-dashboard")
    public ResponseEntity<String> createAndNotify(
            @RequestParam String tableName,
            @RequestParam String dashboardName,
            @RequestParam String cardName,
            @RequestHeader("Authorization") String token) {

        // Étape 1 : Créer une carte à partir d'une table
        String cardIdStr = metabaseService.createQuestionFromTable(tableName, cardName);
        int cardId = Integer.parseInt(cardIdStr); // convertir en entier

        // Étape 2 : Créer un dashboard et y ajouter la carte
        String dashboardIdStr = metabaseService.createDashboardWithCard(dashboardName, cardId);
        int dashboardId = Integer.parseInt(dashboardIdStr);

        // Étape 3 : Récupérer le créateur via le token
        String creator = jwtUtil.extractUsername(token.substring(7));

        // Étape 4 : Envoyer une notification aux utilisateurs
        notificationService.notifyNewDashboard(dashboardName, creator, dashboardId);

        return ResponseEntity.ok("✅ Dashboard créé et notifications envoyées.");
    }*/
@PostMapping("/notify-new-dashboard")
public ResponseEntity<String> createAndNotify(
        @RequestParam String tableName,
        @RequestParam String dashboardName,
        @RequestParam String cardName,
        @RequestParam String creator) {  // Utilisation d'un paramètre creator direct

    // Étape 1 : Créer une carte à partir d'une table
    String cardIdStr = metabaseService.createQuestionFromTable(tableName, cardName);
    int cardId = Integer.parseInt(cardIdStr); // convertir en entier

    // Étape 2 : Créer un dashboard et y ajouter la carte
    String dashboardIdStr = metabaseService.createDashboardWithCard(dashboardName, cardId);
    int dashboardId = Integer.parseInt(dashboardIdStr);

    // Étape 3 : Utiliser directement le nom ou l'email du créateur passé dans la requête
    String creatorName = creator; // Utilisation de 'creator' directement dans la méthode

    // Étape 4 : Envoyer une notification aux utilisateurs
    notificationService.notifyNewDashboard(dashboardName, creatorName, dashboardId);

    return ResponseEntity.ok("✅ Dashboard créé et notifications envoyées.");
}




























}