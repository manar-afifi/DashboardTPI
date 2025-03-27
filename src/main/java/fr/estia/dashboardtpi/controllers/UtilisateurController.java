package fr.estia.dashboardtpi.controllers;

import fr.estia.dashboardtpi.dtos.UtilisateurDTO;
import fr.estia.dashboardtpi.services.IUtilisateurService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final IUtilisateurService utilisateurService;

    @Autowired
    public UtilisateurController(IUtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }


    @PostMapping
    public ResponseEntity<?> ajouterUtilisateur(@RequestBody @Valid UtilisateurDTO utilisateurDTO) {
        try {
            UtilisateurDTO createdUtilisateur = utilisateurService.ajouterUtilisateur(utilisateurDTO);
            return ResponseEntity.ok(createdUtilisateur);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<UtilisateurDTO> obtenirUtilisateurParId(@PathVariable Long id) {
        UtilisateurDTO utilisateur = utilisateurService.obtenirUtilisateurParId(id);
        return ResponseEntity.ok(utilisateurService.obtenirUtilisateurParId(id));
    }

    @GetMapping
    public ResponseEntity<List<UtilisateurDTO>> obtenirTousLesUtilisateurs() {
        List<UtilisateurDTO> utilisateurs = utilisateurService.obtenirTousLesUtilisateurs();
        return ResponseEntity.ok(utilisateurService.obtenirTousLesUtilisateurs());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UtilisateurDTO> modifierUtilisateur(@PathVariable Long id, @RequestBody @Valid UtilisateurDTO utilisateurDTO) {
        UtilisateurDTO modifierUtilisateur = utilisateurService.modifierUtilisateur(id, utilisateurDTO);
        return ResponseEntity.ok(utilisateurService.modifierUtilisateur(id, utilisateurDTO));
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<UtilisateurDTO> updateUtilisateur(
            @PathVariable Long id,
            @RequestPart(required = false) String newName,
            @RequestPart(required = false) String newEmail,
            @RequestPart(required = false) MultipartFile file) {

        System.out.println("🔹 Requête PUT reçue pour ID: " + id);
        System.out.println("🔹 Nouveau nom: " + newName);
        System.out.println("🔹 Fichier reçu: " + (file != null ? file.getOriginalFilename() : "Aucun fichier"));

        UtilisateurDTO updatedUser = utilisateurService.updateUtilisateurInfo(id, newName, newEmail, file);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerUtilisateur(@PathVariable Long id) {
        utilisateurService.supprimerUtilisateur(id);
        return ResponseEntity.noContent().build();
    }
    // ➕ AJOUTER CE ENDPOINT POUR LES STATS
    @GetMapping("/count")
    public ResponseEntity<Long> countUtilisateurs() {
        return ResponseEntity.ok(utilisateurService.countUtilisateurs());
    }

    // ➕ AJOUTER ENDPOINT POUR DERNIER ACCÈS / IMPORT (EXEMPLE)
    @GetMapping("/last-access")
    public ResponseEntity<String> getLastAccess() {
        return ResponseEntity.ok(utilisateurService.getLastAccess().toString());
    }




}
