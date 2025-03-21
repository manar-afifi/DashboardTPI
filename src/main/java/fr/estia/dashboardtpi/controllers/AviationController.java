/*package fr.estia.dashboardtpi.controllers;

import fr.estia.dashboardtpi.services.OpenSkyService;
import fr.estia.dashboardtpi.services.CheckWXService;
import fr.estia.dashboardtpi.services.AviationStackService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/aviation")
public class AviationController {

    private final OpenSkyService openSkyService;
    private final CheckWXService checkWXService;
    private final AviationStackService aviationStackService;

    public AviationController(OpenSkyService openSkyService, CheckWXService checkWXService, AviationStackService aviationStackService) {
        this.openSkyService = openSkyService;
        this.checkWXService = checkWXService;
        this.aviationStackService = aviationStackService;
    }

    // Suivi des vols en temps réel
    @GetMapping("/flights")
    public String getFlights() {
        return openSkyService.getFlightsData();
    }

    // Météo aéronautique par code ICAO
    @GetMapping("/weather/{icao}")
    public String getWeather(@PathVariable String icao) {
        return checkWXService.getWeather(icao);
    }

    // Informations sur les compagnies aériennes
    @GetMapping("/airlines")
    public String getAirlines() {
        return aviationStackService.getAirlines();
    }
}*/
