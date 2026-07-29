{/* ==========================================================
        AI EMPLOYEE DECISION DASHBOARD
========================================================== */}

<div className="dashboard-hero dashboard-fade">

    <div className="hero-left">

        <h2>🧠 AI Employee Decision Dashboard</h2>

        <p>
            Intelligent Employee Lifecycle Management System
        </p>

    </div>

    <div className="hero-right">

        <div className="hero-stat">

            <span>Verification</span>

            <strong>
                {result?.confidence
                    ? `${(result.confidence * 100).toFixed(2)}%`
                    : "--"}
            </strong>

        </div>

        <div className="hero-stat">

            <span>Risk</span>

            <strong>
                {onboarding?.risk || "--"}
            </strong>

        </div>

        <div className="hero-stat">

            <span>Status</span>

            <strong className={
                onboarding?.onboardingStatus === "Ready for Onboarding"
                    ? "valid"
                    : "invalid"
            }>

                {onboarding?.onboardingStatus || "Waiting"}

            </strong>

        </div>

    </div>

</div>