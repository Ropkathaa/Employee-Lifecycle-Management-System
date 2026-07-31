import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DocumentUpload from "./components/DocumentUpload";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DocumentUpload />} />
                <Route path="*" element={<DocumentUpload />} />
            </Routes>
        </Router>
    );
}

export default App;