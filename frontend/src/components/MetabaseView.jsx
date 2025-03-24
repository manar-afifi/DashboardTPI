import React, { useState, useEffect } from "react";
import axios from "axios";
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
        <Container>
            <h2>📊 Importer un Excel et Créer une Table Automatiquement</h2>
            <Input
                placeholder="Nom de la table PostgreSQL"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
            />
            <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <Button onClick={handleImport}>📤 Importer</Button>
            {message && <Message>{message}</Message>}

            <Section>
                <h3>📁 Explorer une Table existante</h3>
                <Select value={selectedTable} onChange={(e) => handleSelectTable(e.target.value)}>
                    <option value="">-- Sélectionner une table --</option>
                    {tables.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </Select>

                {selectedTable && tableData.length > 0 && (
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
                )}
            </Section>

            <Section>
                <h3>🧠 Générer un Dashboard Metabase</h3>
                <Input placeholder="Nom de la carte" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                <Input placeholder="Nom du dashboard" value={dashboardName} onChange={(e) => setDashboardName(e.target.value)} />
                <Button onClick={handleCreateDashboard}>📈 Générer Metabase Dashboard</Button>
            </Section>
        </Container>
    );
};

export default ExcelAutoImporter;

const Container = styled.div`
    max-width: 900px;
    margin: 40px auto;
    padding: 20px;
    background: #fefefe;
    border-radius: 10px;
    text-align: center;
`;

const Section = styled.div`
    margin-top: 40px;
    padding: 20px;
    background: #f8f8f8;
    border-radius: 8px;
`;

const Input = styled.input`
    display: block;
    width: 100%;
    margin: 10px auto;
    padding: 10px;
`;

const Button = styled.button`
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #1db954;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
        background-color: #168f42;
    }
`;

const Message = styled.p`
    margin-top: 20px;
    font-weight: bold;
    color: #c00;
`;

const Select = styled.select`
    padding: 10px;
    font-size: 1rem;
    margin-top: 10px;
    width: 100%;
`;

const Table = styled.table`
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;

    th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #f0f0f0;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
`;
