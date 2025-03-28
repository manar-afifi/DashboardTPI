import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import styled from "styled-components";
import axios from "axios";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);
    const [dashboards, setDashboards] = useState([]);
    const [filteredDashboards, setFilteredDashboards] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const [kpiUsers, setKpiUsers] = useState(0);
    const [kpiDashboards, setKpiDashboards] = useState(0);
    const [kpiTables, setKpiTables] = useState(0);
    const [lastAccess, setLastAccess] = useState("");




    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            navigate("/login");
        } else {
            const parsedUser = JSON.parse(storedUser);
            const userId = parsedUser?.idUtilisateur;

            if (userId) {
                axios
                    .get(`http://localhost:8080/api/utilisateurs/${userId}`)
                    .then((response) => setUser(response.data))
                    .catch((error) =>
                        console.error("Erreur lors du chargement du profil :", error)
                    );
            }
        }
    }, [navigate]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/metabase/dashboards")
            .then(res => setDashboards(res.data))
            .catch(err => console.error("Erreur récupération des dashboards", err));
    }, []);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredDashboards([]);
            return;
        }
        const results = dashboards.filter(d =>
            d.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredDashboards(results);
    }, [search, dashboards]);

    useEffect(() => {
        axios.get("http://localhost:8080/api/utilisateurs/count")
            .then(res => setKpiUsers(res.data));

        axios.get("http://localhost:8080/api/metabase/dashboards")
            .then(res => {
                setDashboards(res.data);
                setKpiDashboards(res.data.length);
            });

        axios.get("http://localhost:8080/api/explorer/tables")
            .then(res => setKpiTables(res.data.length));

        axios.get("http://localhost:8080/api/utilisateurs/last-access")
            .then(res => setLastAccess(res.data));
    }, []);


    return (
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
                        <li onClick={() => navigate("/add")}>Ajouter un graphique</li>
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

                <CenterSection>

                    <SearchInput
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowResults(true);
                        }}
                    />
                    {showResults && filteredDashboards.length > 0 && (
                        <DashboardList>
                            {filteredDashboards.map((d) => (
                                <DashboardItem
                                    key={d.id}
                                    onClick={() =>
                                        navigate("/metabase-viewer", {
                                            state: { dashboardId: d.id }
                                        })
                                    }

                                >
                                    📊 {d.name}
                                </DashboardItem>
                            ))}
                        </DashboardList>
                    )}
                </CenterSection>

                <RightSection>
                    <Notification onClick={() => navigate("/alert")}>🔔</Notification>
                    <ProfileIcon>👤</ProfileIcon>
                </RightSection>
            </Topbar>

            <Title>Salutations, {user ? user.nomUtilisateur : "Chargement..."} !</Title>
            <Message>Bienvenue sur votre tableau de bord</Message>
            <KPIContainer>
                <KPIBox>
                    <IconWrapper>👥</IconWrapper>
                    <KPIContent>
                        <Label>Utilisateurs</Label>
                        <Value>{kpiUsers}</Value>
                    </KPIContent>
                </KPIBox>

                <KPIBox>
                    <IconWrapper>📊</IconWrapper>
                    <KPIContent>
                        <Label>Dashboards</Label>
                        <Value>{kpiDashboards}</Value>
                    </KPIContent>
                </KPIBox>

                <KPIBox>
                    <IconWrapper>🗂</IconWrapper>
                    <KPIContent>
                        <Label>Tables</Label>
                        <Value>{kpiTables}</Value>
                    </KPIContent>
                </KPIBox>

                <KPIBox>
                    <IconWrapper>⏱</IconWrapper>
                    <KPIContent>
                        <Label>Dernière Connexion</Label>
                        <Value>{lastAccess}</Value>
                    </KPIContent>
                </KPIBox>
            </KPIContainer>



        </Container>
    );
};

export default Dashboard;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #330125, #000000);
    color: white;
    height: 100vh;
    padding: 20px;
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

const CenterSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

const SearchInput = styled.input`
    padding: 8px 20px;
    border-radius: 20px;
    border: none;
    outline: none;
    font-size: 15px;
    width: 300px;
`;

const DashboardList = styled.div`
    margin-top: 10px;
    background: white;
    color: black;
    border-radius: 8px;
    width: 320px;
    max-height: 300px;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 45px;
    z-index: 1000;
`;

const DashboardItem = styled.div`
    padding: 10px 15px;
    cursor: pointer;
    border-bottom: 1px solid #ccc;
    transition: background 0.2s;

    &:hover {
        background: #f5f5f5;
    }
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

const Title = styled.h1`
    font-size: 2rem;
    margin-top: 80px;
    margin-bottom: 10px;
`;

const Message = styled.p`
    font-size: 1.2rem;
    color: #ccc;
`;
const KPIContainer = styled.div`
  margin-top: 80px;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  padding: 20px;
`;

const KPIBox = styled.div`
  background: #ffffff;
  color: #000;
  display: flex;
  align-items: center;
  padding: 20px 25px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  min-width: 270px;
  max-width: 320px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const IconWrapper = styled.div`
  background-color: #7a5eff;
  color: white;
  font-size: 22px;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18px;
`;

const KPIContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.span`
  font-size: 0.95rem;
  color: #666;
`;

const Value = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 4px;
`;






