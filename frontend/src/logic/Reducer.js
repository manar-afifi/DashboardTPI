import { reducerCases } from "./ReducerCases";

export const initialState = {
    token: null, // Stocke le token JWT après l'authentification
    userInfo: null, // Stocke les informations de l'utilisateur connecté

    statistics: [], // Stocke les statistiques du dashboard
    activityLogs: [], // Stocke les logs des activités des utilisateurs

    flightTracking: null, // Stocke les données des vols en temps réel (API OpenSky)
    weather: null, // Stocke les informations météo aéronautiques (API CheckWX)
    airlineInfo: null, // Stocke les infos des avions et compagnies (API AviationStack)
};

const reducer = (state, action) => {
    switch (action.type) {
        /** AUTHENTIFICATION **/
        case reducerCases.SET_TOKEN:
            return {
                ...state,
                token: action.token,
            };
        case reducerCases.SET_USER:
            return {
                ...state,
                userInfo: action.userInfo,
            };
        case reducerCases.LOGOUT:
            return {
                ...state,
                token: null,
                userInfo: null,
            };

        /** STATISTIQUES **/
        case reducerCases.SET_STATISTICS:
            return {
                ...state,
                statistics: action.statistics,
            };
        case reducerCases.ADD_STATISTIC:
            return {
                ...state,
                statistics: [...state.statistics, action.statistic],
            };
        case reducerCases.REMOVE_STATISTIC:
            return {
                ...state,
                statistics: state.statistics.filter(stat => stat.id !== action.statisticId),
            };

        /** LOGS D'ACTIVITÉ **/
        case reducerCases.SET_ACTIVITY_LOGS:
            return {
                ...state,
                activityLogs: action.activityLogs,
            };
        case reducerCases.ADD_ACTIVITY_LOG:
            return {
                ...state,
                activityLogs: [...state.activityLogs, action.activityLog],
            };

        /** INTÉGRATION DES API AÉRONAUTIQUES **/
        case reducerCases.SET_FLIGHT_TRACKING:
            return {
                ...state,
                flightTracking: action.flightTracking,
            };
        case reducerCases.SET_WEATHER:
            return {
                ...state,
                weather: action.weather,
            };
        case reducerCases.SET_AIRLINE_INFO:
            return {
                ...state,
                airlineInfo: action.airlineInfo,
            };

        default:
            return state;
    }
};

export default reducer;
