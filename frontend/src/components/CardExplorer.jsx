import React, { useEffect, useState, useRef } from "react";
import {useNavigate, useParams, useLocation} from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [chartType, setChartType] = useState("table");
    const chartRef = useRef();
    const [showDropdown, setShowDropdown] = useState(false);
    const location = useLocation();
    const [tableName, setTableName] = useState("");
    const [xColumn, setXColumn] = useState(""); // Colonne pour l'axe X
    const [yColumn, setYColumn] = useState(""); // Colonne pour l'axe Y

    useEffect(() => {
        const fetchTableName = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/metabase/card-table-name/${cardId}`);
                setTableName(res.data); // exemple: "ventes_2024"
            } catch (err) {
                console.error("❌ Erreur récupération table liée à la carte:", err);
            }
        };

        fetchTableName();
    }, [cardId]);

    useEffect(() => {
        if (location.state?.updatedData && location.state?.updatedColumns) {
            setData(location.state.updatedData);
            setColumns(location.state.updatedColumns);
        }
    }, [location.state]);
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
                // Définir les premières colonnes comme valeurs par défaut pour X et Y
                if (cols.length >= 2) {
                    setXColumn(cols[0]);
                    setYColumn(cols[1]);
                }
            } catch (err) {
                console.error("Erreur chargement des données de la carte:", err);
            }
        };
        fetchData();
    }, [cardId]);

    const exportPDF = async () => {
        const doc = new jsPDF();

        doc.text(`Carte #${cardId}`, 14, 15);


        const headers = columns.length ? [columns] : [];
        const rows = data.length ? data.map(row => columns.map(col => row[col])) : [];

        let finalY = 30;

        if (headers.length && rows.length) {
            autoTable(doc, {
                head: headers,
                body: rows,
                startY: finalY,
                styles: { fontSize: 9, cellPadding: 3 },
                headStyles: { fillColor: [138, 35, 202] },
            });

            finalY = doc.lastAutoTable.finalY + 10;
        }


        const input = chartRef.current;
        if (input) {
            const canvas = await html2canvas(input);
            const imgData = canvas.toDataURL("image/png");
            const pageWidth = doc.internal.pageSize.getWidth();
            const imgProps = doc.getImageProperties(imgData);
            const imgWidth = pageWidth - 20;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

            doc.addImage(imgData, "PNG", 10, finalY, imgWidth, imgHeight);
        }

        doc.save(`carte_${cardId}.pdf`);
    };



    const chartTypes = [
        { label: "🗂 Tableau", value: "table" },
        { label: "📊 Barres", value: "bar" },
        { label: "📈 Ligne", value: "line" },
        { label: "🍰 Camembert", value: "pie" },
        { label: "🌄 Surface", value: "area" },
        { label: "🌧 Nuage de points", value: "scatter" },
    ];

    const renderChart = () => {
        if (!data.length || columns.length < 2) return <p>Pas assez de données pour afficher un graphique.</p>;

        switch (chartType) {
            case "bar":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xColumn} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={yColumn} fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case "line":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xColumn} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={yColumn} stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                );
            case "pie":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie data={data} dataKey={yColumn} nameKey={xColumn} outerRadius={150} label>
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
                            <XAxis dataKey={xColumn} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey={yColumn} stroke="#ffc658" fill="#ffc658" />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case "scatter":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart>
                            <CartesianGrid />
                            <XAxis dataKey={xColumn} name={xColumn} />
                            <YAxis dataKey={yColumn} name={yColumn} />
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
            {/* SIDEBAR */}
            <Sidebar open={sidebarOpen}>
                <SidebarContent>
                    <CloseButton onClick={() => setSidebarOpen(false)}>✖</CloseButton>
                    <h2>Menu</h2>
                    <ul>
                        <li onClick={() => navigate("/")}>🏠 Accueil</li>
                        <li onClick={() => navigate("/dashboard")}> Vue d’ensemble</li>
                        <li onClick={() => navigate("/upload")}> Importer des données</li>
                        <li onClick={() => navigate("/generate-kpi")}> 📊 Générer les KPI</li>
                        <li onClick={() => navigate("/metabase")}> ➕ Nouvelle question</li>
                        <li onClick={() => navigate("/metabase-viewer")}> Visualiser les dashboards</li>
                        <li onClick={() => navigate("/profile")}>👤 Profil</li>
                        <li
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/login");
                            }}
                        >
                            🚪 Déconnexion
                        </li>
                    </ul>
                </SidebarContent>
            </Sidebar>
            <LeftSection>
                <BurgerIcon onClick={() => setSidebarOpen(!sidebarOpen)}>☰</BurgerIcon>
            </LeftSection>
            <Title>📊 Exploration de la carte #{cardId}</Title>

            {/* Sélection des colonnes pour X et Y */}
            <RightPanel>
                <Label>X-Axe:</Label>
                <Select value={xColumn} onChange={(e) => setXColumn(e.target.value)}>
                    {columns.map((col) => (
                        <option key={col} value={col}>{col}</option>
                    ))}
                </Select>

                <Label>Y-Axe:</Label>
                <Select value={yColumn} onChange={(e) => setYColumn(e.target.value)}>
                    {columns.map((col) => (
                        <option key={col} value={col}>{col}</option>
                    ))}
                </Select>
            </RightPanel>
            <DropdownContainer>
                <DropdownButton onClick={() => setShowDropdown(!showDropdown)}>
                    {chartTypes.find(c => c.value === chartType)?.label || "Choisir un graphique"} ⬇️
                </DropdownButton>
                {showDropdown && (
                    <DropdownList>
                    {chartTypes.map(type => (
                            <li key={type.value} onClick={() => {
                                setChartType(type.value);
                                setShowDropdown(false);
                            }}>{type.label}</li>
                        ))}
                    </DropdownList>
                )}
            </DropdownContainer>
            <div ref={chartRef} style={{ marginTop: "30px" }}>
                {renderChart()}
            </div>
            <ExportButton onClick={exportPDF}>📥 Exporter en PDF</ExportButton>
            <EditButton
                onClick={() => {
                    if (!tableName) {
                        alert("❌ Le nom de la table n'est pas encore chargé !");
                        return;
                    }
                    navigate(`/card-editor/${cardId}`, {
                        state: {
                            data,
                            columns,
                            table: tableName,
                        }
                    });
                }}

            >
                ✏️ Modifier
            </EditButton>




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

const DropdownContainer = styled.div`
    position: relative;
    display: inline-block;
    margin-bottom: 20px;
    
`;

const DropdownButton = styled.button`
    padding: 12px 18px;
    background: #1f1f1f;
    color: white;
    border: 1px solid #444;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
`;

const DropdownList = styled.ul`
    position: absolute;
    top: 120%;
    left: 0;
    background: #222;
    border: 1px solid #444;
    border-radius: 10px;
    padding: 10px 0;
    list-style: none;
    margin: 0;
    width: 230px;
    z-index: 100;
    box-shadow: 0 8px 16px rgba(0,0,0,0.25);

    li {
        padding: 12px 18px;
        cursor: pointer;
        transition: background 0.2s;
        color: white;

        &:hover {
            background: #333;
        }
    }
`;
const RightPanel = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  color: white;
  width: 250px;
`;

const Label = styled.label`
  font-size: 1rem;
  display: block;
  margin-bottom: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: #222;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
`;


const StyledTable = styled.table`
  margin: 40px auto;
  width: 95%;
  border-spacing: 0;
  border-radius: 16px;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  color: #fff;

  thead {
    background: linear-gradient(90deg, #833ab4, #fd1d1d, #fcb045);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  th, td {
    padding: 16px 20px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    font-size: 0.95rem;
  }

  th {
    font-weight: 600;
  }

  tbody tr:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.005);
    transition: all 0.2s ease-in-out;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    th, td {
      padding: 10px;
    }
  }
`;

const ExportButton = styled.button`
    margin-top: 30px;
    background: #8a23ca;
    color: white;
    padding: 10px 20px;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: #550557;
    }
`;

const Sidebar = styled.div`
    position: fixed;
    top: 0;
    left: ${(props) => (props.open ? "0" : "-250px")};
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
const LeftSection = styled.div`
    display: flex;
    align-items: center;
`;
const BurgerIcon = styled.div`
    font-size: 26px;
    cursor: pointer;
    color: white;
`;
const EditButton = styled.button`
  margin-top: 20px;
  background: #ffaa00;
  color: black;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  margin-left: 20px;

  &:hover {
    background: #ff8800;
  }
`;
