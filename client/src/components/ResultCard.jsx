import DetailSection from "./DetailSection";

export default function ResultCard({ document }) {

    const status =
        document?.explanation?.decision ||
        document?.status ||
        "UNKNOWN";

    const confidence =
        document?.classification?.confidence ??
        document?.confidence ??
        0;

    const detected =
        document?.classification?.predictedClass ||
        "Unknown";

    return (

        <div className="result-card">

            <div className="summary-grid">

                <div>
                    <strong>📄 Document</strong>
                    <p>{document?.documentName || "Uploaded File"}</p>
                </div>

                <div>
                    <strong>🤖 AI Detected</strong>
                    <p>{detected}</p>
                </div>

                <div>
                    <strong>🎯 Confidence</strong>
                    <p>{(confidence * 100).toFixed(0)}%</p>
                </div>

                <div>
                    <strong>✔ Decision</strong>
                    <p className={status === "VALID" ? "valid" : "invalid"}>
                        {status}
                    </p>
                </div>

            </div>

            <DetailSection
                title="🔒 Document Integrity"
                data={document?.integrity}
            />

            <DetailSection
                title="📝 OCR Extraction"
                data={document?.ocr}
            />

            <DetailSection
                title="🧠 Explainable AI"
                data={document?.explanation?.details?.join("\n")}
            />

        </div>

    );

}