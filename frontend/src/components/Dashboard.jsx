import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const API_URL = "https://opensky-network.org/api/states/all";

const Dashboard = () => {
    const [flights, setFlights] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Gère l'état du sidebar
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }

        fetchFlights();
        const interval = setInterval(fetchFlights, 600000); // Actualisation toutes les 30 sec
        return () => clearInterval(interval);
    }, [navigate]);

    const fetchFlights = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.states) {
                const filteredFlights = data.states
                    .filter(flight => flight[5] !== null && flight[6] !== null)
                    .map(flight => ({
                        id: flight[0],
                        callsign: flight[1]?.trim() || "Inconnu",
                        country: flight[2] || "N/A",
                        longitude: flight[5] || 0,
                        latitude: flight[6] || 0,
                        altitude: flight[7] || 0,
                        velocity: flight[9] || 0,
                        heading: flight[10] || "N/A",
                        verticalRate: flight[11] || "N/A",
                        barometricAltitude: flight[13] || "N/A",
                        transponder: flight[14] || "N/A",
                        onGround: flight[15] ? "Oui" : "Non",
                    }))
                    .slice(0, 50);

                setFlights(filteredFlights);
                // Stocker les données en cache
                localStorage.setItem("flightsData", JSON.stringify(filteredFlights));
                localStorage.setItem("lastFetchTime", Date.now());
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des vols :", error);
        }
    };

    return (
        <Container>
            {/* ☰ Icone pour ouvrir le menu */}
            <BurgerIcon onClick={() => setSidebarOpen(!sidebarOpen)}>☰</BurgerIcon>

            {/* Sidebar Menu */}
            <Sidebar open={sidebarOpen}>
                <SidebarContent>
                    <CloseButton onClick={() => setSidebarOpen(false)}>✖</CloseButton>
                    <h2>Menu</h2>
                    <ul>
                        <li onClick={() => navigate("/")}>🏠 Accueil</li>
                        <li onClick={() => navigate("/profile")}>👤 Profil</li>
                        <li onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/login");
                        }}>🚪 Déconnexion</li>
                    </ul>
                </SidebarContent>
            </Sidebar>

            <Title>✈️ Dashboard - OpenSky Network</Title>

            <TableContainer>
                <Table>
                    <thead>
                    <tr>
                        <Th>Avion</Th>
                        <Th>Pays</Th>
                        <Th>Altitude (m)</Th>
                        <Th>Vitesse (m/s)</Th>
                        <Th>Direction (°)</Th>
                        <Th>Taux montée/descente (m/s)</Th>
                        <Th>Altitude barométrique (m)</Th>
                        <Th>Code transpondeur</Th>
                        <Th>Au sol ?</Th>
                        <Th>Position (Lat, Lng)</Th>
                    </tr>
                    </thead>
                    <tbody>
                    {flights.map((flight) => (
                        <Tr key={flight.id}>
                            <Td>{flight.callsign}</Td>
                            <Td>{flight.country}</Td>
                            <Td>{flight.altitude.toFixed(2)}</Td>
                            <Td>{flight.velocity.toFixed(2)}</Td>
                            <Td>{flight.heading}</Td>
                            <Td>{flight.verticalRate}</Td>
                            <Td>{flight.barometricAltitude}</Td>
                            <Td>{flight.transponder}</Td>
                            <Td>{flight.onGround}</Td>
                            <Td>{flight.latitude.toFixed(2)}, {flight.longitude.toFixed(2)}</Td>
                        </Tr>
                    ))}
                    </tbody>
                </Table>
            </TableContainer>

            <MapContainer
                center={[48.8566, 2.3522]}
                zoom={4}
                style={{ height: "1900px", width: "68%", marginTop: "20px", borderRadius: "10px" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {flights
                    .filter(flight => flight.latitude !== 0 && flight.longitude !== 0)
                    .map((flight) => (
                        <Marker key={flight.id} position={[flight.latitude, flight.longitude]}>
                            <Popup>
                                <strong>✈️ {flight.callsign}</strong> <br />
                                Pays: {flight.country} <br />
                                Altitude: {flight.altitude.toFixed(2)} m <br />
                                Vitesse: {flight.velocity.toFixed(2)} m/s <br />
                                Direction: {flight.heading}° <br />
                                Taux montée/descente: {flight.verticalRate} m/s <br />
                                Altitude barométrique: {flight.barometricAltitude} m <br />
                                Code transpondeur: {flight.transponder} <br />
                                Au sol ? {flight.onGround}
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>
        </Container>
    );
};

export default Dashboard;

// 🌟 STYLES 🌟
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: white;
    height: 100vh;
    padding: 20px;
`;

const BurgerIcon = styled.div`
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 30px;
    cursor: pointer;
    z-index: 10;
`;

const Sidebar = styled.div`
    position: fixed;
    top: 0;
    left: ${props => (props.open ? "0" : "-250px")}; 
    width: 250px;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    transition: 0.3s ease;
    z-index: 20;
    color: white;
`;

const SidebarContent = styled.div`
    padding: 20px;
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        padding: 15px;
        cursor: pointer;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    li:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

const CloseButton = styled.div`
    text-align: right;
    cursor: pointer;
    font-size: 20px;
`;

const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 20px;
`;

const TableContainer = styled.div`
    width: 95%;
    max-width: 1200px;
    overflow-x: auto;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    color: black;
`;

const Th = styled.th`
    background: #007bff;
    color: white;
    padding: 12px;
`;

const Td = styled.td`
    padding: 12px;
    text-align: center;
`;

const Tr = styled.tr`
    &:nth-child(even) {
        background: #f8f9fa;
    }
`;


