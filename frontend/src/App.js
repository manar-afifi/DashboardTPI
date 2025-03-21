import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard"; // Page principale après connexion
import Profile from "./components/Profile";
import EditProfilePage from "./components/EditProfilePage";
import Statistics from "./components/Statistics";
import UploadData from "./components/UploadData";
import GenerateKPI from "./components/GenerateKPI";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Login />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/upload" element={<UploadData />} />
                <Route path="/generate-kpi" element={<GenerateKPI />} />
            </Routes>
        </Router>
    );
}

export default App;
