import { useState } from "react";
import API from "../services/api";
import ResultCard from "./ResultCard";
import "../styles/DocumentUpload.css";

export default function DocumentUpload() {

    /* ==========================================
                DOCUMENT STATES
    ========================================== */

    const [documents, setDocuments] = useState([]);
    const [documentTypes, setDocumentTypes] = useState([]);

    /* ==========================================
                APPLICATION STATES
    ========================================== */

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    /* ==========================================
                AUTOMATION CENTER
    ========================================== */

    const [activeAutomation, setActiveAutomation] = useState(null);

    /* ==========================================
                HR PANEL
    ========================================== */

    const [hrComment, setHrComment] = useState("");

    const [workflowStatus, setWorkflowStatus] = useState({
        upload: false,
        validation: false,
        automation: false,
        hr: false,
        active: false
    });

    /* ==========================================
                AUTOMATION TOGGLE
    ========================================== */

    const toggleAutomation = (module) => {

        setActiveAutomation((previous) =>
            previous === module ? null : module
        );

    };

    /* ==========================================
                FILE CHANGE
    ========================================== */

    const handleFileChange = (e) => {

        const files = Array.from(e.target.files);

        setDocuments(files);

        setDocumentTypes(files.map(() => ""));

        setResults([]);

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

    /* ==========================================
                DOCUMENT TYPE
    ========================================== */

    const handleTypeChange = (index, value) => {

        const updated = [...documentTypes];

        updated[index] = value;

        setDocumentTypes(updated);

    };

    /* ==========================================
                VALIDATE DOCUMENTS
    ========================================== */

    const handleSubmit = async () => {

        if (documents.length === 0) {

            alert("Please upload at least one document.");

            return;

        }

        if (documentTypes.some(type => type === "")) {

            alert("Select document type for every document.");

            return;

        }

        try {

            setLoading(true);

            setError("");

            const formData = new FormData();

            documents.forEach((doc, index) => {

                formData.append("documents", doc);

                formData.append(
                    "documentType",
                    documentTypes[index]
                );

            });

            const response = await API.post(

                "/ai/validate-documents",

                formData,

                {

                    headers: {

                        "Content-Type": "multipart/form-data"

                    }

                }

            );

            const data = response.data.results || [response.data];

            setResults(data);

            setWorkflowStatus((prev) => ({
                ...prev,
                validation: true,
                automation: true
            }));

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.message ||

                "Validation Failed."

            );

        }

        finally {

            setLoading(false);

        }

    };

    /* ==========================================
                HR ACTIONS
    ========================================== */

    const handleApprove = () => {

        setWorkflowStatus((prev) => ({
            ...prev,
            hr: true,
            active: true
        }));

        alert("Employee Approved Successfully.");

    };

    const handleReject = () => {

        setWorkflowStatus((prev) => ({
            ...prev,
            hr: true,
            active: false
        }));

        alert("Employee Rejected.");

    };

    const handleReupload = () => {

        setWorkflowStatus((prev) => ({
            ...prev,
            hr: false,
            active: false
        }));

        alert("Re-upload Requested.");

    };

return (

    <div className="upload-container">

        {/* ===========================
            PAGE HEADER
    =========================== */}

        <div className="page-header">

            <h1 className="main-title">
                Employee Lifecycle
                <br />
                Management System
            </h1>

            <p className="subtitle">
                Professional AI-Powered Employee Onboarding Platform
            </p>

        </div>

        {/* ===========================
            DASHBOARD HERO
    =========================== */}

        <div className="dashboard-hero dashboard-fade">

            <div className="hero-left">

                <h2>
                    🧠 AI Employee Decision Dashboard
                </h2>

                <p>
                    Intelligent Employee Lifecycle Management System
                </p>

            </div>

            <div className="hero-right">

                <div className="hero-stat">

                    <span>Documents</span>

                    <strong>{documents.length}</strong>

                </div>

                <div className="hero-stat">

                    <span>Validated</span>

                    <strong>{results.length}</strong>

                </div>

                <div className="hero-stat">

                    <span>Status</span>

                    <strong
                        className={
                            results.length > 0
                                ? "valid"
                                : "invalid"
                        }
                    >
                        {
                            results.length > 0
                                ? "Ready"
                                : "Waiting"
                        }
                    </strong>

                </div>

            </div>

        </div>

        {/* ===========================
            UPLOAD SECTION
    =========================== */}

        <section className="upload-section">

            <h2 className="section-title">

                📄 Upload Employee Documents

            </h2>

            <input
                type="file"
                multiple
                onChange={handleFileChange}
            />

            {

                documents.map((file, index) => (

                    <div
                        className="document-row"
                        key={index}
                    >

                    <span>

                        {file.name}

                    </span>

                        <select
                            value={documentTypes[index]}
                            onChange={(e) =>
                                handleTypeChange(
                                    index,
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Document Type
                            </option>

                            <option value="CV/Resume">
                                CV / Resume
                            </option>

                            <option value="Academic Certificate">
                                Academic Certificate
                            </option>

                            <option value="Government ID">
                                Government ID
                            </option>

                            <option value="Experience Letter">
                                Experience Letter
                            </option>

                            <option value="Passport">
                                Passport
                            </option>

                        </select>

                    </div>

                ))

            }

            <button
                onClick={handleSubmit}
                disabled={loading}
            >

                {

                    loading
                        ? "Validating..."
                        : "Validate Documents"

                }

            </button>

        </section>

        {

            error &&

            <div className="error-box">

                {error}

            </div>

        }

        {/* ===========================
        VERIFICATION SUMMARY
    =========================== */}

        {

            results.length > 0 &&

            <>

                <h2 className="section-title">

                    Verification Summary

                </h2>

                <div className="verification-summary">

                    <div className="verify-card">

                        <h4>

                            Documents

                        </h4>

                        <div className="verify-value">

                            {results.length}

                        </div>

                    </div>

                    <div className="verify-card">

                        <h4>

                            Uploaded

                        </h4>

                        <div className="verify-value">

                            {documents.length}

                        </div>

                    </div>

                    <div className="verify-card">

                        <h4>

                            Validation

                        </h4>

                        <div className="verify-value valid">

                            Complete

                        </div>

                    </div>

                    <div className="verify-card">

                        <h4>

                            AI Status

                        </h4>

                        <div className="verify-value">

                            Ready

                        </div>

                    </div>

                </div>

            </>

        }

        {/* ===========================
            AI RESULTS
    =========================== */}

        {

            results.map((doc, index) => (

                <ResultCard

                    key={index}

                    document={doc}

                />

            ))

        }

        {/* ==========================================================
                    AUTOMATION CENTER
========================================================== */}

        {
            results.length > 0 &&

            <>

                <h2 className="section-title">
                    🚀 Automation Center
                </h2>

                <div className="automation-grid">

                    {/* ===========================
                    ONBOARDING
            =========================== */}

                    <div
                        className="automation-card"
                        onClick={() => toggleAutomation("onboarding")}
                    >

                        <div className="automation-icon">
                            🚀
                        </div>

                        <h3>AI Onboarding</h3>

                        <p>
                            Automatically prepares onboarding tasks based on
                            verified employee documents.
                        </p>

                        <div className="automation-status valid">
                            READY
                        </div>

                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: "100%" }}
                            />
                        </div>

                        {
                            activeAutomation === "onboarding" &&

                            <div className="automation-details">

                                <h4>Generated Tasks</h4>

                                <ul>

                                    <li>✔ Employee ID Creation</li>

                                    <li>✔ Payroll Registration</li>

                                    <li>✔ Welcome Email</li>

                                    <li>✔ Department Allocation</li>

                                    <li>✔ HR Documentation</li>

                                </ul>

                            </div>
                        }

                    </div>

                    {/* ===========================
                    IT
            =========================== */}

                    <div
                        className="automation-card"
                        onClick={() => toggleAutomation("it")}
                    >

                        <div className="automation-icon">
                            💻
                        </div>

                        <h3>IT Provisioning</h3>

                        <p>
                            Email creation, VPN access,
                            laptop preparation and software allocation.
                        </p>

                        <div className="automation-status valid">
                            READY
                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{ width: "100%" }}
                            />

                        </div>

                        {
                            activeAutomation === "it" &&

                            <div className="automation-details">

                                <h4>Resources</h4>

                                <ul>

                                    <li>✔ Company Email</li>

                                    <li>✔ VPN Access</li>

                                    <li>✔ Laptop Allocation</li>

                                    <li>✔ Git Repository</li>

                                    <li>✔ Teams Account</li>

                                </ul>

                            </div>
                        }

                    </div>

                    {/* ===========================
                    ORIENTATION
            =========================== */}

                    <div
                        className="automation-card"
                        onClick={() => toggleAutomation("orientation")}
                    >

                        <div className="automation-icon">
                            🎓
                        </div>

                        <h3>Orientation Planner</h3>

                        <p>
                            Automatically schedules induction,
                            HR meetings and mandatory trainings.
                        </p>

                        <div className="automation-status valid">
                            READY
                        </div>

                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{ width: "100%" }}
                            />

                        </div>

                        {
                            activeAutomation === "orientation" &&

                            <div className="automation-details">

                                <h4>Orientation Plan</h4>

                                <ul>

                                    <li>✔ HR Introduction</li>

                                    <li>✔ Company Policies</li>

                                    <li>✔ Security Training</li>

                                    <li>✔ Department Meeting</li>

                                    <li>✔ Mentor Assignment</li>

                                </ul>

                            </div>
                        }

                    </div>

                </div>

            </>

        }

        {/* ==========================================================
                    HR DECISION PANEL
========================================================== */}

        {
            results.length > 0 &&

            <div className="hr-panel">

                <h2>
                    HR Decision Panel
                </h2>

                <div className="ai-recommendation">

                    <p>

                        <strong>AI Recommendation :</strong>

                        Employee documents appear valid and
                        onboarding can proceed after HR review.

                    </p>

                    <p>

                        <strong>Current Status :</strong>

                        {
                            workflowStatus.active
                                ? "Employee Activated"
                                : workflowStatus.hr
                                    ? "HR Decision Completed"
                                    : "Awaiting HR Verification"
                        }

                    </p>

                </div>

                <textarea

                    className="hr-comment"

                    placeholder="Enter HR comments..."

                    value={hrComment}

                    onChange={(e) => setHrComment(e.target.value)}

                />

                <div className="hr-actions">

                    <button

                        className="approve-btn"

                        onClick={handleApprove}

                    >

                        ✅ Approve

                    </button>

                    <button

                        className="reject-btn"

                        onClick={handleReject}

                    >

                        ❌ Reject

                    </button>

                    <button

                        className="reupload-btn"

                        onClick={handleReupload}

                    >

                        🔄 Request Re-upload

                    </button>

                </div>

            </div>

        }

        {/* ==========================================================
                    WORKFLOW TIMELINE
========================================================== */}

        {
            results.length > 0 &&

            <>

                <h2 className="section-title">

                    Workflow Timeline

                </h2>

                <div className="workflow">

                    <div className={`workflow-step ${workflowStatus.upload ? "completed" : ""}`}>

                        <div className="workflow-circle">

                            {workflowStatus.upload ? "✓" : "1"}

                        </div>

                        <p>

                            Upload

                        </p>

                    </div>

                    <div className={`workflow-step ${workflowStatus.validation ? "completed" : ""}`}>

                        <div className="workflow-circle">

                            {workflowStatus.validation ? "✓" : "2"}

                        </div>

                        <p>

                            Validation

                        </p>

                    </div>

                    <div className={`workflow-step ${workflowStatus.automation ? "completed" : ""}`}>

                        <div className="workflow-circle">

                            {workflowStatus.automation ? "✓" : "3"}

                        </div>

                        <p>

                            Automation

                        </p>

                    </div>

                    <div className={`workflow-step ${workflowStatus.hr ? "completed" : ""}`}>

                        <div className="workflow-circle">

                            {workflowStatus.hr ? "✓" : "4"}

                        </div>

                        <p>

                            HR Decision

                        </p>

                    </div>

                    <div className={`workflow-step ${workflowStatus.active ? "completed" : ""}`}>

                        <div className="workflow-circle">

                            {workflowStatus.active ? "✓" : "5"}

                        </div>

                        <p>

                            Employee Active

                        </p>

                    </div>

                </div>

            </>

        }

        {/* ==========================================================
                    WORKFLOW TIMELINE
========================================================== */}

        {

            results.length > 0 &&

            <>

                <h2 className="section-title">

                    Workflow Timeline

                </h2>

                <div className="workflow">

                    <div className="workflow-step completed">

                        <div className="workflow-circle">

                            ✓

                        </div>

                        <p>

                            Upload

                        </p>

                    </div>

                    <div className="workflow-step completed">

                        <div className="workflow-circle">

                            ✓

                        </div>

                        <p>

                            Validation

                        </p>

                    </div>

                    <div className="workflow-step completed">

                        <div className="workflow-circle">

                            ✓

                        </div>

                        <p>

                            Explainable AI

                        </p>

                    </div>

                    <div className="workflow-step active">

                        <div className="workflow-circle">

                            4

                        </div>

                        <p>

                            Automation

                        </p>

                    </div>

                    <div className="workflow-step">

                        <div className="workflow-circle">

                            5

                        </div>

                        <p>

                            HR Decision

                        </p>

                    </div>

                    <div className="workflow-step">

                        <div className="workflow-circle">

                            6

                        </div>

                        <p>

                            Employee Active

                        </p>

                    </div>

                </div>

            </>

        }

    </div>

)};