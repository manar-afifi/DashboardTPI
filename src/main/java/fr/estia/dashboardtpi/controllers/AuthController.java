package fr.estia.dashboardtpi.controllers;/*package fr.estia.dashboardtpi.controllers;

import fr.estia.dashboardtpi.dtos.AuthResponse;
import fr.estia.dashboardtpi.dtos.LoginRequest;
import fr.estia.dashboardtpi.entities.Utilisateur;
import fr.estia.dashboardtpi.repositories.UtilisateurRepository;
import fr.estia.dashboardtpi.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDepasse())
            );

            // Si l'authentification réussit, on récupère l'utilisateur
            Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

            // Génération du token JWT
            String token = jwtUtil.generateToken(utilisateur);

            // Retourne le token au frontend
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("⚠️ Identifiants incorrects !");
        }
    }
}*/
import fr.estia.dashboardtpi.dtos.LoginRequest;
import fr.estia.dashboardtpi.entities.Utilisateur;
import fr.estia.dashboardtpi.repositories.UtilisateurRepository;
import fr.estia.dashboardtpi.services.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UtilisateurRepository utilisateurRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 🔹 Authentification et génération du token
            String token = authenticationService.authenticate(request.getEmail(), request.getMotDepasse());

            // 🔹 Récupération de l'utilisateur dans la base de données
            Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(request.getEmail());

            if (utilisateurOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur introuvable !");
            }

            Utilisateur utilisateur = utilisateurOpt.get();

            // 🔹 Création de la réponse avec le token et les infos de l'utilisateur
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("idUtilisateur", utilisateur.getIdUtilisateur());
            response.put("nomUtilisateur", utilisateur.getNomUtilisateur());
            response.put("email", utilisateur.getEmail());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou mot de passe incorrect !");
        }
    }
}







