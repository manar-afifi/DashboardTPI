package fr.estia.dashboardtpi.services;

import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    public String authenticate(String email, String motDePasse) {
        return "fake-token";
    }
}
