export const reducerCases = {
    SET_TOKEN: "SET_TOKEN", // Stocker le token JWT après la connexion
    SET_USER: "SET_USER", // Définir les informations de l'utilisateur connecté
    LOGOUT: "LOGOUT", // Déconnexion de l'utilisateur

    SET_STATISTICS: "SET_STATISTICS", // Charger les statistiques affichées dans le dashboard
    ADD_STATISTIC: "ADD_STATISTIC", // Ajouter une nouvelle statistique
    REMOVE_STATISTIC: "REMOVE_STATISTIC", // Supprimer une statistique

    SET_ACTIVITY_LOGS: "SET_ACTIVITY_LOGS", // Charger les logs d'activités des utilisateurs
    ADD_ACTIVITY_LOG: "ADD_ACTIVITY_LOG", // Ajouter un log d'activité

    SET_FLIGHT_TRACKING: "SET_FLIGHT_TRACKING", // Stocker les données de suivi des vols en temps réel
    SET_WEATHER: "SET_WEATHER", // Stocker les données météo aéronautiques
    SET_AIRLINE_INFO: "SET_AIRLINE_INFO", // Stocker les infos des compagnies aériennes et avions
};
