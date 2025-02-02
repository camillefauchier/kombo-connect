import Companies from "./pages/Companies";
import Integration from "./pages/Integration";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
    return (
        <div className="app-container">
            <Router>
                <nav className="navbar">
                    <ul>
                        <li><Link to="/integrations">Intégration</Link></li>
                        <li><Link to="/companies">Entreprises</Link></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/integrations" element={<Integration />} />
                    <Route path="/companies" element={<Companies />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
