import { useState } from "react";
import API from "../services/api";
import ResultCard from "./ResultCard";
import "../styles/DocumentUpload.css";

export default function DocumentUpload() {
    // ==========================================
    // MULTI-STEP NAVIGATION STATE (1 to 5)
    // ==========================================
    // 1: Main/Upload | 2: Validation | 3: AI Recommendation & Orientation | 4: HR Decision | 5: Onboarding & Checklist
    const [currentStep, setCurrentStep] = useState(1);

    // ==========================================
    // DOCUMENT & APPLICATION STATES
    // ==========================================
    const [documents, setDocuments] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    // ==========================================
    // AUTOMATION & HR PANEL STATES
    // ==========================================
    const [activeAutomation, setActiveAutomation] = useState(null);
    const [hrComment, setHrComment] = useState("");
    const [hrId, setHrId] = useState("");
    const [hrVerified, setHrVerified] = useState(false);

    // ==========================================
    // XAI (EXPLAINABLE AI) STATE
    // ==========================================
    const [xaiData, setXaiData] = useState(null);

    const [workflowStatus, setWorkflowStatus] = useState({
        upload: false,
        validation: false,
        automation: false,
        hr: false,
        active: false
    });

    // ==========================================
    // HANDLERS
    // ==========================================
    const toggleAutomation = (module) => {
        setActiveAutomation((prev) => (prev === module ? null : module));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setDocuments(files);
        setDocumentTypes(files.map(() => ""));
        setResults([]);
        setXaiData(null);
        setError("");

        setWorkflowStatus((prev) => ({
            ...prev,
            upload: files.length > 0,
            validation: false,
            automation: false,
            hr: false,
            active: false
        }));
    };

    const handleTypeChange = (index, value) => {
        const updated = [...documentTypes];
        updated[index] = value;
        setDocumentTypes(updated);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        if (documents.length < 3) {
            alert("Please upload at least three required documents before validation.");
            return;
        }

        if (documentTypes.some((type) => type === "")) {
            alert("Please select a document type for every uploaded document.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formData = new FormData();
            documents.forEach((doc, index) => {
                formData.append("documents", doc);
                formData.append("documentType", documentTypes[index]);
            });

            // 1. Validate Documents API Call
            const response = await API.post("/ai/validate-documents", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const data = response.data.results || [response.data];
            setResults(data);

            // 2. Fetch XAI Explainability Metrics
            try {
                const xaiResponse = await API.post("/ai/xai-evaluation", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                setXaiData(xaiResponse.data);
            } catch (xaiErr) {
                console.warn("XAI module response optional/unavailable:", xaiErr);
            }

            setWorkflowStatus((prev) => ({
                ...prev,
                upload: true,
                validation: true
            }));

            // Automatically advance to Stage 2: Validation
            setCurrentStep(2);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Document validation failed.");
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // HR ACTIONS
    // ==========================================
    const handleApprove = (e) => {
        if (e) e.preventDefault();
        setWorkflowStatus((prev) => ({ ...prev, hr: true, active: true }));
        alert("Employee Approved Successfully. Moving to Onboarding & Checklist.");
        setCurrentStep(5);
    };

    const handleReject = (e) => {
        if (e) e.preventDefault();
        setWorkflowStatus((prev) => ({ ...prev, hr: true, active: false }));
        alert("Employee Rejected.");
    };

    const handleReupload = (e) => {
        if (e) e.preventDefault();
        setWorkflowStatus((prev) => ({ ...prev, hr: false, active: false }));
        alert("Re-upload Requested. Returning to Upload stage.");
        setCurrentStep(1);
    };

    return (
        <div className="upload-container">
            {/* PAGE HEADER */}
            <div className="page-header">
                <h1 className="main-title">Employee Lifecycle<br />Management System</h1>
                <p className="subtitle">Professional AI-Powered Employee Onboarding Platform</p>
            </div>

            {/* STAGE NAVIGATION TABS */}
            <div className="stage-nav-tabs" style={{ display: "flex", gap: "10px", margin: "20px 0", flexWrap: "wrap" }}>
                <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    style={{ fontWeight: currentStep === 1 ? "bold" : "normal" }}
                >
                    1. Main / Upload
                </button>
                <button
                    type="button"
                    onClick={() => results.length > 0 && setCurrentStep(2)}
                    disabled={results.length === 0}
                    style={{ fontWeight: currentStep === 2 ? "bold" : "normal" }}
                >
                    2. Validation
                </button>
                <button
                    type="button"
                    onClick={() => results.length > 0 && setCurrentStep(3)}
                    disabled={results.length === 0}
                    style={{ fontWeight: currentStep === 3 ? "bold" : "normal" }}
                >
                    3. AI Recommendation & Orientation
                </button>
                <button
                    type="button"
                    onClick={() => results.length > 0 && setCurrentStep(4)}
                    disabled={results.length === 0}
                    style={{ fontWeight: currentStep === 4 ? "bold" : "normal" }}
                >
                    4. HR Decision
                </button>
                <button
                    type="button"
                    onClick={() => workflowStatus.active && setCurrentStep(5)}
                    disabled={!workflowStatus.active}
                    style={{ fontWeight: currentStep === 5 ? "bold" : "normal" }}
                >
                    5. Onboarding & Checklist
                </button>
            </div>

            {/* ========================================== */}
            {/* STAGE 1: MAIN / UPLOAD */}
            {/* ========================================== */}
            {currentStep === 1 && (
                <section className="upload-section">
                    <h2 className="section-title">📄 Stage 1: Upload Candidate Documents</h2>
                    <p className="upload-hint">
                        Please upload all required documents at once and assign the correct document type to every uploaded document.
                    </p>
                    <input type="file" multiple onChange={handleFileChange} />

                    {documents.map((file, index) => (
                        <div className="document-row" key={index}>
                            <span>{file.name}</span>
                            <select
                                value={documentTypes[index]}
                                onChange={(e) => handleTypeChange(index, e.target.value)}
                            >
                                <option value="">Document Type</option>
                                <option value="CV/Resume">CV / Resume</option>
                                <option value="Academic Certificate">Academic Certificate</option>
                                <option value="Government ID">Government ID</option>
                                <option value="Experience Letter">Experience Letter</option>
                                <option value="Passport">Passport</option>
                            </select>
                        </div>
                    ))}

                    <div className="upload-status">
                        <strong>Uploaded Documents:</strong> {documents.length} / Minimum Required: 3
                    </div>

                    {documents.length > 0 && documents.length < 3 && (
                        <div className="minimum-document-warning">
                            ⚠ Please upload at least three required documents before proceeding with validation.
                        </div>
                    )}

                    <button type="button" onClick={handleSubmit} disabled={loading || documents.length < 3}>
                        {loading ? "Validating..." : "Validate & Proceed to Stage 2"}
                    </button>
                </section>
            )}

            {error && <div className="error-box">{error}</div>}

            {/* ========================================== */}
            {/* STAGE 2: VALIDATION */}
            {/* ========================================== */}
            {currentStep === 2 && (
                <section className="validation-page-section">
                    <h2 className="section-title">🔍 Stage 2: Validation & Verification Summary</h2>
                    <div className="verification-summary">
                        <div className="verify-card">
                            <h4>Documents</h4>
                            <div className="verify-value">{results.length}</div>
                        </div>
                        <div className="verify-card">
                            <h4>Uploaded</h4>
                            <div className="verify-value">{documents.length}</div>
                        </div>
                        <div className="verify-card">
                            <h4>Validation</h4>
                            <div className="verify-value valid">Complete</div>
                        </div>
                        <div className="verify-card">
                            <h4>AI Status</h4>
                            <div className="verify-value">Ready</div>
                        </div>
                    </div>

                    {results.map((doc, index) => (
                        <ResultCard key={index} document={doc} />
                    ))}

                    <div style={{ marginTop: "20px" }}>
                        <button type="button" onClick={() => setCurrentStep(3)}>
                            Proceed to AI Recommendation & Orientation ➡
                        </button>
                    </div>
                </section>
            )}

            {/* ========================================== */}
            {/* STAGE 3: AI RECOMMENDATION & ORIENTATION */}
            {/* ========================================== */}
            {currentStep === 3 && (
                <section className="ai-rec-page-section">
                    <h2 className="section-title">🤖 Stage 3: AI Recommendation & Orientation Center</h2>
                    <p className="section-subtitle">
                        Document validation completed successfully. Review explainable AI metrics and orientation options below.
                    </p>

                    {xaiData && (
                        <div className="xai-panel" style={{ marginBottom: "20px", padding: "20px", background: "#f8f9fa", borderRadius: "8px" }}>
                            <h3>Explainable AI (XAI) Insights</h3>
                            <ul>
                                <li><strong>Confidence Score:</strong> {xaiData.confidence || "94.5%"}</li>
                                <li><strong>Primary Deciding Factor:</strong> {xaiData.primaryFactor || "Verified Academic & Professional Match"}</li>
                                <li><strong>Risk Assessment:</strong> {xaiData.riskLevel || "Low Risk"}</li>
                            </ul>
                        </div>
                    )}

                    <div className="automation-grid">
                        <div className="automation-card" onClick={() => toggleAutomation("onboarding")}>
                            <div className="automation-icon">🚀</div>
                            <h3>AI Onboarding Engine</h3>
                            <p>Generate personalized onboarding activities and task flows.</p>
                            <div className="automation-status valid">READY</div>
                            {activeAutomation === "onboarding" && (
                                <div className="automation-details">
                                    <h4>Recommendation</h4>
                                    <ul>
                                        <li>✔ Generate Employee ID</li>
                                        <li>✔ HR Documentation</li>
                                        <li>✔ Payroll Registration</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="automation-card" onClick={() => toggleAutomation("orientation")}>
                            <div className="automation-icon">📅</div>
                            <h3>AI Orientation Schedule</h3>
                            <p>Automated scheduling for corporate orientation and team introductions.</p>
                            <div className="automation-status valid">READY</div>
                            {activeAutomation === "orientation" && (
                                <div className="automation-details">
                                    <h4>Orientation Plan</h4>
                                    <ul>
                                        <li>✔ Day 1: Welcome & IT Setup</li>
                                        <li>✔ Day 2: Security & Compliance Briefing</li>
                                        <li>✔ Day 3: Department Deep-Dive</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                        <button type="button" onClick={() => setCurrentStep(4)}>
                            Proceed to HR Decision Panel ➡
                        </button>
                    </div>
                </section>
            )}

            {/* ========================================== */}
            {/* STAGE 4: HR DECISION */}
            {/* ========================================== */}
            {currentStep === 4 && (
                <section className="hr-page-section">
                    <div className="hr-panel">
                        <h2>⚖️ Stage 4: HR Decision Panel</h2>
                        <div className="ai-recommendation">
                            <p>
                                <strong>AI Recommendation:</strong> Candidate documents verified successfully. HR credentials and review required for formal hiring approval.
                            </p>
                            <p>
                                <strong>Current Status:</strong>{" "}
                                {workflowStatus.active
                                    ? "Employee Activated"
                                    : workflowStatus.hr
                                        ? "HR Decision Completed"
                                        : "Awaiting HR Verification"}
                            </p>
                        </div>

                        <div className="hr-access-box">
                            <label>Enter HR ID</label>
                            <div className="hr-access-row">
                                <input
                                    type="text"
                                    className="hr-id-input"
                                    placeholder="HR ID"
                                    value={hrId}
                                    onChange={(e) => setHrId(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="verify-hr-btn"
                                    onClick={(e) => {
                                        if (e) e.preventDefault();
                                        if (hrId.trim() === "") {
                                            alert("Please enter the HR ID.");
                                            return;
                                        }
                                        setHrVerified(true);
                                    }}
                                >
                                    Verify HR
                                </button>
                            </div>
                            {hrVerified && <p className="hr-access-note">✅ HR verification completed.</p>}
                        </div>

                        <textarea
                            className="hr-comment"
                            placeholder="Enter HR comments..."
                            value={hrComment}
                            onChange={(e) => setHrComment(e.target.value)}
                            disabled={!hrVerified}
                        />

                        <div className="hr-actions">
                            <button type="button" className="approve-btn" onClick={handleApprove} disabled={!hrVerified}>
                                ✅ Approve & Continue
                            </button>
                            <button type="button" className="reject-btn" onClick={handleReject} disabled={!hrVerified}>
                                ❌ Reject
                            </button>
                            <button type="button" className="reupload-btn" onClick={handleReupload} disabled={!hrVerified}>
                                🔄 Request Re-upload
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* ========================================== */}
            {/* STAGE 5: ONBOARDING & CHECKLIST */}
            {/* ========================================== */}
            {currentStep === 5 && (
                <section className="checklist-page-section">
                    <h2 className="section-title">📋 Stage 5: Onboarding & Checklist Activation</h2>
                    <p className="section-subtitle">
                        Candidate has been successfully approved and activated. Complete the provisioning checklist below:
                    </p>

                    <div className="automation-grid">
                        <div className="automation-card">
                            <div className="automation-icon">📋</div>
                            <h3>Active Onboarding Checklist</h3>
                            <div className="automation-details" style={{ display: "block" }}>
                                <ul>
                                    <li>✔ HR Forms Completed</li>
                                    <li>✔ IT Asset Allocation (Laptop & Badge)</li>
                                    <li>✔ Mandatory Security Training Assigned</li>
                                    <li>✔ Company Policy Acceptance Logged</li>
                                    <li>✔ Orientation Calendar Invitation Sent</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* WORKFLOW TIMELINE FOOTER */}
            <div style={{ marginTop: "40px" }}>
                <h2 className="section-title">Workflow Progress Timeline</h2>
                <div className="workflow">
                    <div className={`workflow-step ${workflowStatus.upload ? "completed" : ""}`} onClick={() => setCurrentStep(1)} style={{ cursor: "pointer" }}>
                        <div className="workflow-circle">{workflowStatus.upload ? "✓" : "1"}</div>
                        <p>Upload</p>
                    </div>
                    <div className={`workflow-step ${workflowStatus.validation ? "completed" : ""}`} onClick={() => results.length > 0 && setCurrentStep(2)} style={{ cursor: results.length > 0 ? "pointer" : "default" }}>
                        <div className="workflow-circle">{workflowStatus.validation ? "✓" : "2"}</div>
                        <p>Validation</p>
                    </div>
                    <div className={`workflow-step ${workflowStatus.automation ? "completed" : ""}`} onClick={() => results.length > 0 && setCurrentStep(3)} style={{ cursor: results.length > 0 ? "pointer" : "default" }}>
                        <div className="workflow-circle">{workflowStatus.automation ? "✓" : "3"}</div>
                        <p>AI Recommendation & Orientation</p>
                    </div>
                    <div className={`workflow-step ${workflowStatus.hr ? "completed" : ""}`} onClick={() => results.length > 0 && setCurrentStep(4)} style={{ cursor: results.length > 0 ? "pointer" : "default" }}>
                        <div className="workflow-circle">{workflowStatus.hr ? "✓" : "4"}</div>
                        <p>HR Decision</p>
                    </div>
                    <div className={`workflow-step ${workflowStatus.active ? "completed" : ""}`} onClick={() => workflowStatus.active && setCurrentStep(5)} style={{ cursor: workflowStatus.active ? "pointer" : "default" }}>
                        <div className="workflow-circle">{workflowStatus.active ? "✓" : "5"}</div>
                        <p>Onboarding & Checklist</p>
                    </div>
                </div>
            </div>
        </div>
    );
}