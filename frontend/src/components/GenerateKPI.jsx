import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

const FichierKPI = () => {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [kpis, setKpis] = useState([]);
    const [selectedKpi, setSelectedKpi] = useState(null);
    const navigate = useNavigate();


    useEffect(() => {
        const uploaded = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
        setFiles(uploaded);

        const selected = JSON.parse(localStorage.getItem('selectedFile'));
        if (selected) handleFileSelect(selected);
    }, []);

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        localStorage.setItem('selectedFile', JSON.stringify(file));


        const base64Data = file.fileContent.split(',')[1];
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const workbook = XLSX.read(bytes, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const firstRow = sheet[0];
        const kpiList = [];

        Object.keys(firstRow).forEach((key) => {
            const values = sheet.map(row => row[key]).filter(Boolean);
            const numericValues = values.map(v => parseFloat(v)).filter(v => !isNaN(v));

            if (numericValues.length === values.length) {
                const sum = numericValues.reduce((a, b) => a + b, 0);
                const avg = sum / numericValues.length;
                const data = Object.entries(
                    numericValues.reduce((acc, val) => {
                        acc[val] = (acc[val] || 0) + 1;
                        return acc;
                    }, {})
                ).map(([name, value]) => ({ name, value }));

                kpiList.push({ type: 'numeric', key, label: `Moyenne de ${key}`, value: avg.toFixed(2), data });
                kpiList.push({ type: 'numeric', key, label: `Somme de ${key}`, value: sum.toFixed(2), data });
            } else {
                const countMap = {};
                values.forEach(val => countMap[val] = (countMap[val] || 0) + 1);
                const mostFrequent = Object.entries(countMap).sort((a, b) => b[1] - a[1])[0];
                const data = Object.entries(countMap).map(([name, value]) => ({ name, value }));

                kpiList.push({ type: 'categorical', key, label: `Catégorie fréquente de ${key}`, value: mostFrequent?.[0], data });
            }
        });

        setKpis(kpiList);
        setSelectedKpi(null);
    };


    return (
        <Container>
            <Sidebar>
                <h3>Fichiers importés</h3>
                {files.map((f, i) => (
                    <FileButton key={i} onClick={() => handleFileSelect(f)}>
                        {f.name}
                    </FileButton>
                ))}
            </Sidebar>

            <Main>
                <TopBar>
                    <BackButton onClick={() => navigate('/dashboard')}>← Retour au Dashboard</BackButton>
                </TopBar>
                <h2>KPIs du fichier : {selectedFile?.name}</h2>

                <KpiContainer>
                    {kpis.map((k, i) => (
                        <KpiCard key={i} onClick={() => setSelectedKpi(k)}>
                            <h4>{k.label}</h4>
                            <p>{k.value}</p>
                        </KpiCard>
                    ))}
                </KpiContainer>

                {selectedKpi && (
                    <ChartSection>
                        <h3>Graphique : {selectedKpi.label}</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            {selectedKpi.type === 'categorical' ? (
                                <PieChart>
                                    <Pie data={selectedKpi.data} dataKey="value" nameKey="name" outerRadius={100} label>
                                        {selectedKpi.data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            ) : (
                                <BarChart data={selectedKpi.data}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </ChartSection>
                )}
            </Main>
        </Container>
    );
};

export default FichierKPI;

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #2a0845, #300c5e, #ff6ec4);
    color: #fff;
`;

const Sidebar = styled.div`
    width: 250px;
    background: #1f0938;
    padding: 20px;
    border-right: 1px solid #444;
`;

const FileButton = styled.button`
    display: block;
    background: transparent;
    border: none;
    color: #ddd;
    margin-bottom: 10px;
    text-align: left;
    cursor: pointer;
    &:hover {
        color: #fff;
        font-weight: bold;
    }
`;

const Main = styled.div`
    flex: 1;
    padding: 30px;
`;

const KpiContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
`;

const KpiCard = styled.div`
    background: white;
    color: #212529;
    padding: 20px;
    border-radius: 12px;
    width: 200px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
        transform: scale(1.05);
        background: #f8f9fa;
    }
`;

const ChartSection = styled.div`
    margin-top: 40px;
    background: white;
    padding: 20px;
    border-radius: 12px;
    color: #212529;
`;
const TopBar = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
`;

const BackButton = styled.button`
    background: #ffffff;
    color: #2a0845;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    transition: background 0.3s ease;

    &:hover {
        background: #ececec;
    }
`;

