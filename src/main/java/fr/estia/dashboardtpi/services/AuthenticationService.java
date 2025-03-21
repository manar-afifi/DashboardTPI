package fr.estia.dashboardtpi.services;

import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    public String authenticate(String email, String motDePasse) {
        // Ici, ajoute la logique pour vérifier l'authentification et retourner un token.
        return "fake-token"; // Remplace ceci par un vrai token (JWT)
    }
}
