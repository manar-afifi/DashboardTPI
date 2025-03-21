import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const UploadData = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    // 📂 Lire le fichier Excel
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            setData(parsedData);
            localStorage.setItem("uploadedData", JSON.stringify(parsedData));
        };
        reader.readAsBinaryString(file);
    };

    return (
        <Container>
            <Title>📂 Charger un fichier Excel</Title>
            <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            {data.length > 0 && (
                <>
                    <TableContainer>
                        <Table>
                            <thead>
                            <tr>
                                {Object.keys(data[0]).map((key, index) => (
                                    <Th key={index}>{key}</Th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Object.values(row).map((value, colIndex) => (
                                        <Td key={colIndex}>{value}</Td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </TableContainer>
                    <Button onClick={() => navigate("/generate-kpi")}>🚀 Générer des KPIs</Button>
                </>
            )}
        </Container>
    );
};

export default UploadData;

// 🎨 **Styles**
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

const Input = styled.input`
    margin-bottom: 20px;
    padding: 10px;
    background: white;
`;

const TableContainer = styled.div`
    width: 80%;
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

const Button = styled.button`
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
