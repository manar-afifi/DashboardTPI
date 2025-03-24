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

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #000000, #3e0231);
    color: white;
    min-height: 100vh;
    padding: 40px 20px;
`;

const Title = styled.h1`
    font-size: 2.5rem;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Input = styled.input`
    padding: 10px 15px;
    border-radius: 8px;
    border: none;
    font-size: 1rem;
    background-color: white;
    color: #333;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        background-color: #f2f2f2;
    }
`;

const TableContainer = styled.div`
    width: 90%;
    max-width: 1000px;
    margin-top: 30px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: white;
    color: black;
    font-size: 0.95rem;
`;

const Th = styled.th`
    background: #08056c;
    color: white;
    padding: 12px;
    text-align: center;
`;

const Td = styled.td`
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #ccc;
`;

const Button = styled.button`
    margin-top: 30px;
    padding: 12px 24px;
    font-size: 1.1rem;
    cursor: pointer;
    border: none;
    background: #5e055d;
    color: white;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
        background: #50073f;
        transform: scale(1.05);
    }
`;

