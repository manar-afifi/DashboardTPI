import React from "react";
import { PieChart, Pie, Tooltip, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
    const navigate = useNavigate();

    // 📊 **Récupération des données**
    const flights = JSON.parse(localStorage.getItem("flightsData")) || [];

    // 🛫 **Statistiques globales**
    const totalFlights = flights.length;
    const flightsOnGround = flights.filter(f => f.onGround === "Oui").length;
    const flightsInAir = totalFlights - flightsOnGround;

    // 🌍 **Top 5 des pays avec le plus de vols**
    const countryCount = flights.reduce((acc, flight) => {
        acc[flight.country] = (acc[flight.country] || 0) + 1;
        return acc;
    }, {});
    const topCountries = Object.entries(countryCount)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    // 🚀 **Données pour les vitesses des avions**
    const speedChartData = flights.map(flight => ({
        name: flight.callsign,
        speed: flight.velocity,
    }));

    return (
        <Container>
            <Title>📊 Dashboard Analytique</Title>

            {/* 🏷️ Cartes statistiques */}
            <StatsContainer>
                <StatCard>✈️ Total des vols : {totalFlights}</StatCard>
                <StatCard>🛬 Vols au sol : {flightsOnGround}</StatCard>
                <StatCard>🛫 Vols en l'air : {flightsInAir}</StatCard>
            </StatsContainer>

            {/* 📊 Graphiques alignés en ligne */}
            <ChartsRow>
                {/* 🌍 Pie Chart - Vols par pays */}
                <ChartBox>
                    <h3>🌍 Top 5 des pays avec le plus de vols</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={topCountries} dataKey="count" nameKey="country" cx="50%" cy="50%" outerRadius={100}>
                                {topCountries.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"][index % 5]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartBox>

                {/* 🚀 Bar Chart - Vitesse des avions */}
                <ChartBox>
                    <h3>🚀 Vitesse des avions</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={speedChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="speed" fill="#007bff" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartBox>
            </ChartsRow>

            <BackButton onClick={() => navigate("/")}>⬅ Retour au Dashboard</BackButton>
        </Container>
    );
};

export default Analytics;

// 🌟 **STYLES**
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #1a1a2e, #16213e);
    color: white;
    height: 100vh;
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 20px;
`;

const StatsContainer = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
`;

const StatCard = styled.div`
    background: #007bff;
    padding: 15px 30px;
    border-radius: 10px;
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const ChartsRow = styled.div`
    display: flex;
    gap: 20px;
    justify-content: center;
    width: 90%;
`;

const ChartBox = styled.div`
    background: white;
    color: black;
    padding: 20px;
    border-radius: 10px;
    flex: 1;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const BackButton = styled.button`
    margin-top: 20px;
    padding: 12px 24px;
    font-size: 1.2rem;
    cursor: pointer;
    border: none;
    background: #ff6b6b;
    color: white;
    border-radius: 5px;
    transition: 0.3s;
    
    &:hover {
        background: #d43f3f;
    }
`;
