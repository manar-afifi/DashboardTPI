import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const CardEditor = () => {
    const { cardId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [columns, setColumns] = useState(state.columns || []);
    const [data, setData] = useState(state.data || []);
    const [title] = useState(`Carte #${cardId}`);
    const [tableName, setTableName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTable = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/metabase/card-table-name/${cardId}`);
                setTableName(res.data);
            } catch (err) {
                alert("❌ Impossible de récupérer la table liée à cette carte.");
            }
        };
        fetchTable();
    }, [cardId]);

    const handleCellChange = (rowIndex, col, value) => {
        const updated = [...data];
        updated[rowIndex][col] = value;
        setData(updated);
    };

    const addColumn = () => {
        const newCol = prompt("Nom de la colonne :");
        if (newCol && !columns.includes(newCol)) {
            setColumns([...columns, newCol]);
            setData(data.map(row => ({ ...row, [newCol]: "" })));
        }
    };

    const addRow = () => {
        const newRow = {};
        columns.forEach(col => newRow[col] = "");
        setData([...data, newRow]);
    };

    const saveChanges = async () => {
        if (!tableName) {
            alert("❌ Table non définie !");
            return;
        }
        try {
            await axios.post(`http://localhost:8080/api/card/update/${cardId}`, {
                table: tableName,
                columns,
                data
            });
            navigate(`/explorer/${cardId}`);
        } catch (error) {
            alert("❌ Erreur lors de la sauvegarde : " + error.message);
        }
    };

    const filteredData = data.filter(row => {
        return columns.some(col =>
            row[col] && row[col].toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <Container>
            <h2>🛠 Modifier {title}</h2>
            <SearchBar>
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </SearchBar>
            <ControlBar>
                <button onClick={addColumn}>➕ Nouvelle Colonne</button>
                <button onClick={addRow}>➕ Nouvelle Ligne</button>
            </ControlBar>
            <TableWrapper>
                <Table>
                    <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={i}>{col}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col, j) => (
                                <td key={j}>
                                    <input
                                        value={row[col]}
                                        onChange={(e) => handleCellChange(i, col, e.target.value)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </TableWrapper>
            <Buttons>
                <button onClick={() => navigate(`/explorer/${cardId}`)}>⬅ Retour</button>
                <button onClick={saveChanges} disabled={!tableName}>💾 Sauvegarder</button>
            </Buttons>
        </Container>
    );
};

export default CardEditor;

const Container = styled.div`
    padding: 40px;
    background: linear-gradient(135deg, #2a0845, #300c5e, #ff6ec4);
    color: #fdfdfd;
    min-height: 100vh;
`;
const SearchBar = styled.div`
    input {
        padding: 8px;
        font-size: 1rem;
        border: none;
        border-radius: 8px;
        width: 200px; 
        margin-left: auto;
        background-color: #fff;
        color: #333;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    }
    input:focus {
        outline: none;
        border-color: #5c6bc0;
    }
`;


const ControlBar = styled.div`
    margin: 20px 0;

    button {
        background-color: #73087c;
        color: white;
        padding: 12px 24px;
        font-size: 1rem;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #1f1f75;
        }

        &:not(:last-child) {
            margin-right: 15px;
        }
    }
`;
const TableWrapper = styled.div`
    max-height: 600px; 
    overflow-y: auto; 
    margin-top: 20px;
`;
const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;

    th, td {
        padding: 16px 24px;
        text-align: left;
        font-size: 1rem;
        border-bottom: 1px solid #e0e0e0;
    }

    th {
        background-color: #653fa5;
        color: white;
        font-weight: bold;
    }

    td input {
        width: 100%;
        background: transparent;
        color: #333;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 8px;
        font-size: 1rem;
        transition: all 0.3s;
    }

    td input:focus {
        outline: none;
        border-color: #5c6bc0;
    }

    tr:hover {
        background-color: #f5f5f5;
    }
`;

const Buttons = styled.div`
    margin-top: 30px;

    button {
        background-color: #5d1563;
        color: white;
        padding: 12px 24px;
        font-size: 1rem;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-right: 10px;
    }

    button:disabled {
        background-color: #b0b0b0;
    }

    button:hover {
        background-color: #1f1f75;
    }
`;

