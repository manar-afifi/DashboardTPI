import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard"; // Page principale après connexion
import Profile from "./components/Profile";
import EditProfilePage from "./components/EditProfilePage";

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
            </Routes>
        </Router>
    );
}

export default App;
