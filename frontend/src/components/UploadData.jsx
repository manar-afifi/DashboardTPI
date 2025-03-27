import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { filesize } from "filesize";
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach(async (file) => {
            const base64 = await fileToBase64(file);

            setFiles((prevFiles) => {
                if (prevFiles.some(f => f.name === file.name)) return prevFiles;

                const newFile = {
                    fileContent: base64,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    progress: 0,
                };


                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    setFiles((current) =>
                        current.map((f) =>
                            f.name === file.name ? { ...f, progress: Math.min(progress, 100) } : f
                        )
                    );
                    if (progress >= 100) clearInterval(interval);
                }, 150);

                return [...prevFiles, newFile];
            });
        });
    }, []);


    const removeFile = (name) => {
        setFiles((prev) => prev.filter((f) => f.name !== name));
    };
    useEffect(() => {
        const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles"));
        if (savedFiles && savedFiles.length > 0) {
            const withProgress = savedFiles.map(f => ({
                ...f,
                progress: 100
            }));
            setFiles(withProgress);
        }
    }, []);


    useEffect(() => {
        localStorage.setItem("uploadedFiles", JSON.stringify(files));
    }, [files]);

    const handleFileClick = (file) => {
        localStorage.setItem("selectedFile", JSON.stringify(file));
        window.location.href = "/generate-kpi";
    };


    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const fileTypes = new Set(files.map((f) => f.type.split("/")[1]));

    return (
        <Wrapper>

            <Header>

                <Title>📁Import de Fichiers</Title>
                <BackButton onClick={() => navigate('/dashboard')}>← Retour au Dashboard</BackButton>
            </Header>
            {files.length > 0 && (
                <KpiWrapper>
                    <KpiSection>
                        <KPI>
                            <Label>Progression</Label>
                            <Value>100%</Value>
                        </KPI>
                        <KPI>
                            <Label>Types de fichiers</Label>
                            <Value>{fileTypes.size}</Value>
                        </KPI>
                        <KPI>
                            <Label>Taille totale</Label>
                            <Value>{filesize(totalSize)}</Value>
                        </KPI>
                    </KpiSection>
                </KpiWrapper>

            )}


            <DropZoneContainer {...useDropzone({ onDrop })}>
                <UploadIcon>⬆️</UploadIcon>
                <UploadText>Glissez-déposez vos fichiers ici</UploadText>
                <Or>ou</Or>
                <SelectButton as="label">
                    Sélectionner des fichiers
                    <input type="file" multiple onChange={(e) => onDrop(Array.from(e.target.files))} hidden />
                </SelectButton>
                <SmallText>Tous types de fichiers acceptés</SmallText>
            </DropZoneContainer>

            {files.length > 0 && (
                <Scrollable>
                    <FileSection>
                        <SectionTitle>Fichiers ({files.length})</SectionTitle>
                        <FileListWrapper>
                        {files.map((f, i) => (
                            <FileCard key={i} onClick={() => handleFileClick(f)}>
                                <FileInfo>
                                    <FileIcon>📊</FileIcon>
                                    <div>
                                        <strong>{f.name}</strong>
                                        <div>{filesize(f.size)}</div>
                                    </div>
                                </FileInfo>
                                <ProgressBar>
                                    <Progress style={{ width: `${f.progress}%` }} />
                                </ProgressBar>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {f.progress === 100 && <SuccessIcon>✔️</SuccessIcon>}
                                    <DeleteButton onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(f.name);
                                    }}>
                                        ❌
                                    </DeleteButton>

                                </div>
                            </FileCard>

                        ))}
                        </FileListWrapper>
                    </FileSection>
                </Scrollable>
            )}
        </Wrapper>
    );

};

export default UploadPage;

const Wrapper = styled.div`
    background: linear-gradient(135deg, #2a0845, #300c5e, #ff6ec4);
    min-height: 100vh;
    padding: 40px 30px;
    font-family: 'Segoe UI', sans-serif;
`;

const Scrollable = styled.div`
    max-height: 75vh;
    overflow-y: auto;
    padding-right: 10px;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 25px;
`;



const Title = styled.h1`
    font-size: 2rem;
    color: #fdfdfd;
`;

const DropZoneContainer = styled.div`
    border: 2px dashed #ced4da;
    border-radius: 10px;
    padding: 40px;
    text-align: center;
    background: #f1f3f5;
    color: #495057;
    max-width: 1115px;
    margin: 0 auto 30px auto;
`;

const UploadIcon = styled.div`
    font-size: 2.5rem;
    margin-bottom: 10px;
    color: #0d6efd;
`;

const UploadText = styled.h2`
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 6px;
`;

const Or = styled.div`
    margin: 10px 0;
    font-size: 0.9rem;
    color: #666;
`;

const SelectButton = styled.button`
    background: #3235cd;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    font-size: 0.95rem;
    transition: background 0.3s;

    &:hover {
        background: #5b36a4;
    }
`;

const SmallText = styled.p`
    color: #868e96;
    margin-top: 8px;
    font-size: 0.9rem;
`;

const FileSection = styled.div`
    margin-top: 40px;
`;

const SectionTitle = styled.h3`
    margin-bottom: 15px;
    font-size: 1.3rem;
    color: #fdfdfd;
`;

const FileCard = styled.div`
    background: white;
    border-radius: 8px;
    padding: 15px 20px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    gap: 20px;
`;

const FileIcon = styled.div`
    font-size: 1.8rem;
`;

const FileInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
    flex: 1;
`;

const ProgressBar = styled.div`
    width: 120px;
    height: 8px;
    background: #e9ecef;
    border-radius: 5px;
    overflow: hidden;
    margin: 0 10px;
`;

const Progress = styled.div`
    height: 100%;
    background: #5f3dc4;
    transition: width 0.2s ease-in-out;
`;

const DeleteButton = styled.button`
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #868e96;
    &:hover {
        color: red;
    }
`;

const KpiSection = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 30px;
`;

const KPI = styled.div`
    background: white;
    padding: 20px 30px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    flex: 1;
    min-width: 200px;
    text-align: center;
`;

const Label = styled.div`
    color: #495057;
    margin-bottom: 10px;
    font-size: 1rem;
`;

const Value = styled.div`
    font-size: 1.6rem;
    font-weight: bold;
    color: #212529;
`;

const SuccessIcon = styled.div`
    color: #2ecc71;
    font-size: 1.2rem;
    margin-right: 8px;
`;
const KpiWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;
const FileListWrapper = styled.div`
    max-height: 300px;
    overflow-y: auto;
    padding-right: 8px;

    /* Optionnel : scrollbar jolie */
    scrollbar-width: thin;
    scrollbar-color: #2f0c59 transparent;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 10px;
    }
`;


const BackButton = styled.button`
    background: #ffffff;
    color: #2a0845;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: background 0.3s ease;

    &:hover {
        background: #b879cf;
    }
`;

