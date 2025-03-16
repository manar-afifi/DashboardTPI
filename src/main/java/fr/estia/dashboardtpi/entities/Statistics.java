package fr.estia.dashboardtpi.entities;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "statistics")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor

public class Statistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String metricName; // Exemple : "Nombre d'utilisateurs"

    private Double value; // Valeur (ex: 1200.5 utilisateurs)

    private LocalDate date; // Date de la mesure
}

