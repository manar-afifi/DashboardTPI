import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import {
    BarChart, Bar,
    LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    AreaChart, Area,
    ScatterChart, Scatter
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#0088fe", "#d0ed57", "#a4de6c"];

const CardExplorer = () => {
    const { cardId } = useParams();
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [chartType, setChartType] = useState("table");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/metabase/card-data/${cardId}`);
                const raw = res.data;
                const cols = raw.data.cols.map(col => col.name);
                const rows = raw.data.rows.map(row => {
                    const obj = {};
                    cols.forEach((col, i) => obj[col] = row[i]);
                    return obj;
                });
                setColumns(cols);
                setData(rows);
            } catch (err) {
                console.error("Erreur chargement des données de la carte:", err);
            }
        };
        fetchData();
    }, [cardId]);

    const xKey = columns[0];
    const yKey = columns[1];

    const renderChart = () => {
        if (!data.length || columns.length < 2) return <p>Pas assez de données pour afficher un graphique.</p>;

        switch (chartType) {
            case "bar":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xKey} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={yKey} fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case "line":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xKey} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={yKey} stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case "pie":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie data={data} dataKey={yKey} nameKey={xKey} outerRadius={150} label>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                );
            case "area":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xKey} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey={yKey} stroke="#ffc658" fill="#ffc658" />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case "scatter":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart>
                            <CartesianGrid />
                            <XAxis dataKey={xKey} name={xKey} />
                            <YAxis dataKey={yKey} name={yKey} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Scatter name="Points" data={data} fill="#0088fe" />
                        </ScatterChart>
                    </ResponsiveContainer>
                );
            default:
                return (
                    <StyledTable>
                        <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col}>{col}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col) => (
                                    <td key={col}>{row[col]}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </StyledTable>
                );
        }
    };

    return (
        <Container>
            <Title>📊 Exploration de la carte #{cardId}</Title>
            <SelectWrapper>
                Choisir une visualisation :
                <select id="chartType" value={chartType} onChange={(e) => setChartType(e.target.value)}>
                    <option value="table">🗂 Tableau</option>
                    <option value="bar">📊 Barres</option>
                    <option value="line">📈 Ligne</option>
                    <option value="pie">🍰 Camembert</option>
                    <option value="area">🌄 Surface</option>
                    <option value="scatter">🌧 Nuage de points</option>
                </select>
            </SelectWrapper>
            <div style={{ marginTop: "30px" }}>
                {renderChart()}
            </div>
        </Container>
    );
};

export default CardExplorer;

const Container = styled.div`
    min-height: 100vh;
    padding: 40px 20px;
    background: linear-gradient(135deg, #0a0a0a, #3e0231);
    color: white;
`;

const Title = styled.h2`
    font-size: 2rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const SelectWrapper = styled.div`
    margin: 20px 0;
    font-size: 1rem;

    select {
        margin-left: 10px;
        padding: 8px 12px;
        font-size: 1rem;
        border-radius: 6px;
        border: none;
        outline: none;
    }
`;

const StyledTable = styled.table`
    margin: 30px auto;
    width: 90%;
    border-collapse: collapse;
    background: #fff;
    color: #333;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0,0,0,0.2);

    th, td {
        padding: 12px 15px;
        text-align: center;
        border-bottom: 1px solid #ddd;
    }

    th {
        background: #7b2cbf;
        color: white;
        font-weight: 600;
    }

    tr:hover td {
        background: #f1f1f1;
    }
`;
