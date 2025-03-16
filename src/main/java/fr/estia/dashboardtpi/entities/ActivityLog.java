package fr.estia.dashboardtpi.entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action; // Exemple: "Connexion", "Ajout d'un utilisateur"

    private String username; // Utilisateur qui a fait l'action

    private LocalDateTime timestamp; // Date et heure de l'action

    @ManyToOne
    @JoinColumn(name = "id_utilisateur", nullable = false)
    private Utilisateur utilisateur;
}
