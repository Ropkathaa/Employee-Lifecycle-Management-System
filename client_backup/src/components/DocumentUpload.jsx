import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/ai/validate-documents";

function DocumentUpload() {

    const [documents, setDocuments] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFiles = (e) => {

        const files = Array.from(e.target.files);

        setDocuments(files);

        setDocumentTypes(
            files.map(() => "")
        );
    };

    const handleTypeChange = (index, value) => {

        const updated = [...documentTypes];

        updated[index] = value;

        setDocumentTypes(updated);
    };

    const uploadDocuments = async () => {

        if (documents.length === 0) {
            alert("Select at least one document.");
            return;
        }

        const formData = new FormData();

        documents.forEach(file => {
            formData.append("documents", file);
        });

        documentTypes.forEach(type => {
            formData.append("documentType", type);
        });

        try {

            setLoading(true);

            const response = await axios.post(
                API_URL,
                formData
            );

            setResult(response.data);

        } catch (error) {

            console.error(error);

            setResult(
                error.response?.data || {
                    message: "Upload Failed"
                }
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div
            style={{
                maxWidth: "800px",
                margin: "auto",
                background: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}
        >

            <h2>AI Document Validation</h2>

            <input
                type="file"
                multiple
                onChange={handleFiles}
            />

            <br /><br />

            {

                documents.map((file, index) => (

                    <div
                        key={index}
                        style={{
                            marginBottom: "15px"
                        }}
                    >

                        <strong>{file.name}</strong>

                        <br />

                        <input
                            type="text"
                            placeholder="Document Type"
                            value={documentTypes[index]}
                            onChange={(e) =>
                                handleTypeChange(index, e.target.value)
                            }
                            style={{
                                width: "100%",
                                padding: "8px"
                            }}
                        />

                    </div>

                ))

            }

            <button
                onClick={uploadDocuments}
                disabled={loading}
            >

                {

                    loading
                        ? "Uploading..."
                        : "Validate Documents"

                }

            </button>

            <br /><br />

            {

                result &&

                <pre>

                    {

                        JSON.stringify(
                            result,
                            null,
                            2
                        )

                    }

                </pre>

            }

        </div>

    );

}

export default DocumentUpload;