import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard"; // Page principale après connexion
import Profile from "./components/Profile";
import EditProfilePage from "./components/EditProfilePage";
import Statistics from "./components/Statistics";
import UploadData from "./components/UploadData";
import GenerateKPI from "./components/GenerateKPI";
import MetabaseView from "./components/MetabaseView";
import MetabaseViewer from "./components/MetabaseViewer";
import CardViewer from "./components/CardViewer";
import CardExplorer from "./components/CardExplorer";
import HeroPage from "./components/HeroPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<HeroPage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                {/*<Route path="/statistics" element={<Statistics />} />*/}
                <Route path="/upload" element={<UploadData />} />
                <Route path="/generate-kpi" element={<GenerateKPI />} />
                <Route path="/metabase" element={<MetabaseView />} />
                <Route path="/metabase-viewer" element={<MetabaseViewer />} />
                <Route path="/card/:cardId" element={<CardViewer />} />
                <Route path="/explorer/:cardId" element={<CardExplorer />} />
            </Routes>
        </Router>
    );
}

export default App;
