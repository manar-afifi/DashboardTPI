import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ExcelAutoImporter = () => {
    const [tableName, setTableName] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState("");
    const [tableData, setTableData] = useState([]);
    const [cardName, setCardName] = useState("");
    const [dashboardName, setDashboardName] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/explorer/tables");
            setTables(res.data);
        } catch (error) {
            console.error("Erreur chargement tables :", error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage("");
    };

    const handleImport = async () => {
        if (!file || !tableName) {
            setMessage("❌ Veuillez fournir un nom de table et un fichier.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("table", tableName);

        try {
            const response = await axios.post("http://localhost:8080/api/import/excel-auto", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            setMessage("✅ " + response.data);
            fetchTables();
        } catch (error) {
            setMessage("❌ Importation échouée : " + (error.response?.data || error.message));
        }
    };

    const handleSelectTable = async (name) => {
        setSelectedTable(name);
        try {
            const res = await axios.get(`http://localhost:8080/api/explorer/table/${name}`);
            setTableData(res.data);
        } catch (err) {
            setMessage("❌ Impossible de charger les données : " + err.message);
        }
    };

    const handleCreateDashboard = async () => {
        if (!selectedTable || !cardName || !dashboardName) {
            setMessage("❗ Remplir tous les champs pour créer un dashboard.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/metabase/generate-dashboard", null, {
                params: {
                    tableName: selectedTable,
                    cardName: cardName,
                    dashboardName: dashboardName
                }
            });
            setMessage("✅ Dashboard Metabase créé avec succès !");
        } catch (error) {
            setMessage("❌ Erreur création dashboard : " + JSON.stringify(error.response?.data || error.message));
        }
    };

    return (
        <PageWrapper>
        <Container>
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
                        <li onClick={() => navigate("/add")}> Ajouter un graphique</li>
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
            <Topbar>
                <LeftSection>
                    <BurgerIcon onClick={() => setSidebarOpen(!sidebarOpen)}>☰</BurgerIcon>
                </LeftSection>
                <RightSection>
                    <Notification>🔔</Notification>
                    <ProfileIcon>👤</ProfileIcon>
                </RightSection>
            </Topbar>
            <Title>📊 Importer un Excel et Créer une Table Automatiquement</Title>
            <Input
                placeholder="Nom de la table PostgreSQL"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
            />
            <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <Button onClick={handleImport}>📤 Importer</Button>
            {message && <Message>{message}</Message>}

            <Section>
                <SectionTitle>📁 Explorer une Table existante</SectionTitle>
                <Select value={selectedTable} onChange={(e) => handleSelectTable(e.target.value)}>
                    <option value="">-- Sélectionner une table --</option>
                    {tables.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </Select>

                {selectedTable && tableData.length > 0 && (
                    <TableWrapper>
                        <Table>
                            <thead>
                            <tr>
                                {Object.keys(tableData[0]).map((col) => (
                                    <th key={col}>{col}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map((row, i) => (
                                <tr key={i}>
                                    {Object.values(row).map((val, j) => (
                                        <td key={j}>{val}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </TableWrapper>
                )}
            </Section>

            <Section>
                <SectionTitle>🧠 Générer un Dashboard Metabase</SectionTitle>
                <Input placeholder="Nom de la carte" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                <Input placeholder="Nom du dashboard" value={dashboardName} onChange={(e) => setDashboardName(e.target.value)} />
                <Button onClick={handleCreateDashboard}>📈 Générer Metabase Dashboard</Button>
            </Section>
        </Container>
        </PageWrapper>
    );
};

export default ExcelAutoImporter;

const Container = styled.div`
    max-width: 900px;
    margin: 40px auto;
    padding: 20px;
    background: #121212;
    border-radius: 12px;
    color: #ffffff;
    font-family: 'Poppins', sans-serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.6);
`;

const Title = styled.h2`
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 20px;
`;

const Section = styled.div`
    margin-top: 40px;
    padding: 20px;
    background: #1f1f1f;
    border-radius: 10px;
    box-shadow: inset 0 0 10px rgba(255,255,255,0.05);
`;

const SectionTitle = styled.h3`
    margin-bottom: 20px;
    color: #f2f2f2;
`;

const Input = styled.input`
    display: block;
    width: 95%;
    margin: 10px auto;
    padding: 12px 15px;
    border-radius: 8px;
    border: 1px solid #444;
    background: #2a2a2a;
    color: #fff;
    font-size: 1rem;
`;

const Button = styled.button`
    margin-top: 15px;
    padding: 12px 25px;
    background: linear-gradient(to right, #8e2de2, #4a00e0);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
        background: linear-gradient(to right, #4a00e0, #8e2de2);
    }
`;

const Message = styled.p`
    margin-top: 20px;
    font-weight: 500;
    color: #f54242;
`;

const Select = styled.select`
    padding: 12px;
    font-size: 1rem;
    margin-top: 15px;
    width: 100%;
    border-radius: 8px;
    border: 1px solid #444;
    background: #2a2a2a;
    color: #fff;
`;

const TableWrapper = styled.div`
    max-height: 300px;
    overflow-y: auto;
    margin-top: 20px;
    border-radius: 8px;
    border: 1px solid #333;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    color: #fff;

    th, td {
        border: 1px solid #444;
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #333;
    }

    tr:nth-child(even) {
        background-color: #1a1a1a;
    }
`;
const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #330125, #000000);
    color: white;
    height: 200vh;
    
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

const Topbar = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    z-index: 15;
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

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const Notification = styled.div`
    font-size: 22px;
    cursor: pointer;
`;

const ProfileIcon = styled.div`
    font-size: 22px;
    cursor: pointer;
`;
