package fr.estia.dashboardtpi.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Entity
@AllArgsConstructor
@Table(name = "utilisateur")
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder

public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUtilisateur;

    private String nomUtilisateur;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String motDepasse;

    // private String role;
    @ElementCollection(fetch = FetchType.EAGER)
    @Builder.Default
    private Set<String> roles = new HashSet<>(); // Prenons un exemple : ["ROLE_ADMIN", "ROLE_USER"]

    @Column(columnDefinition = "TEXT")
    private String photoUtilisateur; // la photo de profil de l'utilisateur

    @OneToMany(mappedBy = "utilisateur", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActivityLog> activityLogs;


    // Méthode pour ajouter un rôle à l'utilisateur
    public void addRole(String role) {
        this.roles.add(role);
    }


    @Column(name = "derniere_connexion")
    private LocalDateTime derniereConnexion;

    public LocalDateTime getDerniereConnexion() {
        return derniereConnexion;
    }

    public void setDerniereConnexion(LocalDateTime derniereConnexion) {
        this.derniereConnexion = derniereConnexion;
    }

}
