import Companies from "./pages/Companies";
import Integration from "./pages/Integration";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
  <div className="app-container">
      <Router>
        <Routes>
          <Route path="/integrations" element={<Integration />} />
          <Route path="/companies" element={<Companies />} />
        </Routes>
      </Router>
  </div>
  );
}

export default App;
