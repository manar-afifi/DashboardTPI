package fr.estia.dashboardtpi.mappers;

import fr.estia.dashboardtpi.dtos.UtilisateurDTO;
import fr.estia.dashboardtpi.entities.Utilisateur;
import fr.estia.dashboardtpi.entities.ActivityLog;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UtilisateurMapper {

    public UtilisateurDTO toDto(Utilisateur entity) {
        if (entity == null) {
            return null;
        }

        return UtilisateurDTO
                .builder()
                .idUtilisateur(entity.getIdUtilisateur())
                .nomUtilisateur(entity.getNomUtilisateur())
                .email(entity.getEmail())
                .motDepasse(entity.getMotDepasse())
                .photoUtilisateur(entity.getPhotoUtilisateur())
                .roles(entity.getRoles() != null ? entity.getRoles().stream().collect(Collectors.toList()) : null)
                .activityLogs(entity.getActivityLogs() != null
                        ? entity.getActivityLogs().stream()
                        .map(ActivityLog::getAction)
                        .collect(Collectors.toList())
                        : null)
                .build();
    }

    public Utilisateur toEntity(UtilisateurDTO dto) {
        if (dto == null) {
            return null;
        }

        return Utilisateur
                .builder()
                .idUtilisateur(dto.getIdUtilisateur())
                .nomUtilisateur(dto.getNomUtilisateur())
                .email(dto.getEmail())
                .motDepasse(dto.getMotDepasse())
                .photoUtilisateur(dto.getPhotoUtilisateur())
                .roles(dto.getRoles() != null ? dto.getRoles().stream().collect(Collectors.toSet()) : null)
                .build();
    }
}
