import React from "react";
import DocumentUpload from "./components/DocumentUpload";

function App() {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f7fb",
                padding: "40px"
            }}
        >
            <DocumentUpload />
        </div>
    );
}

export default App;