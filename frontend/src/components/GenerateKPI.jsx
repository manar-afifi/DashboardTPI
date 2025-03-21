import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Tooltip, PieChart, Pie, Cell } from "recharts";

const GenerateKPI = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [kpiOptions, setKpiOptions] = useState([]);
    const [selectedKPI, setSelectedKPI] = useState(null);
    const [columnNames, setColumnNames] = useState([]);

    useEffect(() => {
        // Charger les données depuis le localStorage (provenant du fichier Excel uploadé)
        const rawData = JSON.parse(localStorage.getItem("uploadedData")) || [];
        setData(rawData);
        if (rawData.length > 0) {
            generateKPIOptions(rawData);
            setColumnNames(Object.keys(rawData[0])); // Stocker les noms des colonnes
        }
    }, []);

    const generateKPIOptions = (rawData) => {
        if (rawData.length === 0) return;

        const firstRow = rawData[0]; // Prend la première ligne pour détecter les colonnes
        let options = [];

        Object.keys(firstRow).forEach((col) => {
            if (typeof firstRow[col] === "number") {
                options.push(`Moyenne de ${col}`);
                options.push(`Somme de ${col}`);
                options.push(`Répartition de ${col}`);
            } else {
                options.push(`Répartition des catégories de ${col}`);
            }
        });
        setKpiOptions(options);
    };

    const handleGenerateKPI = (kpi) => {
        setSelectedKPI(kpi);
    };

    const renderChart = () => {
        if (!selectedKPI || data.length === 0) return null;
        let chartData = [];

        if (selectedKPI.includes("Moyenne")) {
            const column = selectedKPI.replace("Moyenne de ", "");
            const avg = (data.reduce((sum, row) => sum + row[column], 0) / data.length).toFixed(2);
            return <KPIText>Moyenne de {column} : <strong>{avg}</strong></KPIText>;
        }

        if (selectedKPI.includes("Somme")) {
            const column = selectedKPI.replace("Somme de ", "");
            const sum = data.reduce((sum, row) => sum + row[column], 0);
            return <KPIText>Somme de {column} : <strong>{sum}</strong></KPIText>;
        }

        if (selectedKPI.includes("Répartition des catégories")) {
            const column = selectedKPI.replace("Répartition des catégories de ", "");
            const counts = {};
            data.forEach((row) => {
                counts[row[column]] = (counts[row[column]] || 0) + 1;
            });
            chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));
            return (
                <PieChart width={400} height={300}>
                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            );
        }

        return null;
    };

    return (
        <Container>
            <Title>📊 Génération Automatique de KPIs</Title>

            {/* Affichage des colonnes détectées */}
            {columnNames.length > 0 && (
                <ColumnsContainer>
                    <h3>📂 Colonnes détectées :</h3>
                    <ColumnsList>
                        {columnNames.map((col, index) => (
                            <ColumnItem key={index}>{col}</ColumnItem>
                        ))}
                    </ColumnsList>
                </ColumnsContainer>
            )}

            <KPIList>
                {kpiOptions.map((kpi, index) => (
                    <KPIButton key={index} onClick={() => handleGenerateKPI(kpi)}>
                        {kpi}
                    </KPIButton>
                ))}
            </KPIList>

            <ChartContainer>{renderChart()}</ChartContainer>

            <BackButton onClick={() => navigate("/upload")}>⬅ Retour</BackButton>
        </Container>
    );
};

export default GenerateKPI;

// 🌟 **STYLES** 🌟
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
    font-size: 2rem;
    margin-bottom: 20px;
`;

const ColumnsContainer = styled.div`
    background: #fff;
    color: black;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    text-align: center;
`;

const ColumnsList = styled.ul`
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
`;

const ColumnItem = styled.li`
    background: #007bff;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
`;

const KPIList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
`;

const KPIButton = styled.button`
    background: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
        background: #0056b3;
    }
`;

const ChartContainer = styled.div`
    background: white;
    color: black;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const KPIText = styled.h3`
    font-size: 1.5rem;
    color: black;
    text-align: center;
`;

const BackButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
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
