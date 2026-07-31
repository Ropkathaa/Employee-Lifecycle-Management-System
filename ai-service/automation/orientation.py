# ==========================================================
# AI Orientation Planning
# Employee Lifecycle Management System
# ==========================================================

from automation.xai import DOCUMENT_CATEGORY_MAP, generate_xai_explanation


def generate_orientation(
    predicted_class,
    confidence,
    expected_type,
    integrity=True,
    ocr_success=True,
    candidate_data=None
):

    # ---------------------------------------
    # Safe Handling
    # ---------------------------------------

    predicted_class = str(predicted_class or "").strip().upper()
    expected_type = str(expected_type or "").strip()
    confidence = float(confidence or 0)

    detected_category = DOCUMENT_CATEGORY_MAP.get(
        predicted_class,
        predicted_class
    )

    matched = (
        detected_category.lower()
        ==
        expected_type.lower()
    )

    # ---------------------------------------
    # AI Decision Configuration
    # ---------------------------------------

    HIGH_CONFIDENCE = 0.90
    MEDIUM_CONFIDENCE = 0.75
    LOW_CONFIDENCE = 0.60

    DOCUMENT_MATCH_WEIGHT = 2
    INTEGRITY_WEIGHT = 2
    OCR_WEIGHT = 1

    # ---------------------------------------
    # AI Decision Engine
    # ---------------------------------------

    score = int(confidence * 100)
    reasoning = []
    recommendation = ""
    risk = ""
    orientation_status = ""
    orientation_plan = []

    orientation_recommendation = {
        "decision": "Pending",
        "confidenceLevel": "Unknown",
        "priority": "Normal",
        "requiresHRReview": True
    }

    if not integrity:
        orientation_status = "Orientation Blocked"
        risk = "High"
        score = max(score - (INTEGRITY_WEIGHT * 15), 0)
        reasoning.extend([
            "Document integrity verification failed.",
            "The uploaded document may have been modified or is invalid.",
            "Employee orientation cannot begin until document verification is successful."
        ])
        recommendation = (
            "Orientation cannot begin until document verification succeeds."
        )
        orientation_recommendation = {
            "decision": "Do Not Schedule",
            "confidenceLevel": "Low",
            "priority": "High",
            "requiresHRReview": True
        }

    elif not matched:
        orientation_status = "Awaiting Correct Document"
        risk = "High"
        score = max(score - (DOCUMENT_MATCH_WEIGHT * 15), 0)
        reasoning.extend([
            "Uploaded document does not match the selected document category.",
            "Employee identity verification could not be completed.",
            "A valid document is required before orientation scheduling."
        ])
        recommendation = (
            "Upload the correct employee document before scheduling orientation."
        )
        orientation_recommendation = {
            "decision": "Do Not Schedule",
            "confidenceLevel": "Low",
            "priority": "High",
            "requiresHRReview": True
        }

    elif confidence < MEDIUM_CONFIDENCE:
        orientation_status = "Pending HR Review"
        risk = "Medium"
        reasoning.extend([
            "AI confidence is below the recommended threshold.",
            "Automated verification is inconclusive.",
            "HR verification is required before orientation scheduling."
        ])
        recommendation = (
            "Orientation will be scheduled after HR verification."
        )
        orientation_recommendation = {
            "decision": "Manual Review",
            "confidenceLevel": "Medium",
            "priority": "Medium",
            "requiresHRReview": True
        }

    elif not ocr_success:
        orientation_status = "Awaiting Better Document"
        risk = "Medium"
        score = max(score - (OCR_WEIGHT * 10), 0)
        reasoning.extend([
            "OCR could not extract sufficient employee information.",
            "Document image quality is insufficient.",
            "A clearer document should be uploaded."
        ])
        recommendation = (
            "Orientation is postponed until employee information can be extracted."
        )
        orientation_recommendation = {
            "decision": "Re-upload Required",
            "confidenceLevel": "Medium",
            "priority": "Medium",
            "requiresHRReview": False
        }

    else:
        orientation_status = "Orientation Ready"
        risk = "Low"
        score = min(
            score +
            (DOCUMENT_MATCH_WEIGHT * 2) +
            (INTEGRITY_WEIGHT * 2) +
            OCR_WEIGHT,
            100
        )
        reasoning.extend([
            "Document category matched successfully.",
            "Identity verification completed successfully.",
            "Document integrity verification passed.",
            "OCR extracted employee information successfully.",
            "AI confidence exceeded the recommended acceptance threshold."
        ])
        recommendation = (
            "Employee is eligible for AI-assisted orientation."
        )
        orientation_recommendation = {
            "decision": "Schedule Orientation",
            "confidenceLevel": "High",
            "priority": "Normal",
            "requiresHRReview": False
        }

    # ---------------------------------------
    # Personalized Orientation Plan
    # ---------------------------------------

    if orientation_status == "Orientation Ready":
        orientation_plan = [
            {"step": 1, "session": "Welcome & Company Introduction", "department": "Human Resources", "status": "Scheduled", "priority": "High"},
            {"step": 2, "session": "HR Policies and Employee Benefits", "department": "Human Resources", "status": "Scheduled", "priority": "High"},
            {"step": 3, "session": "Information Security & Cyber Awareness", "department": "Information Security", "status": "Scheduled", "priority": "High"},
            {"step": 4, "session": "Code of Conduct & Workplace Ethics", "department": "Compliance", "status": "Scheduled", "priority": "Medium"},
            {"step": 5, "session": "IT Systems & Employee Portal Walkthrough", "department": "Information Technology", "status": "Scheduled", "priority": "Medium"},
            {"step": 6, "session": "Department Introduction", "department": "Business Unit", "status": "Scheduled", "priority": "Medium"},
            {"step": 7, "session": "Manager Meet & Goal Setting", "department": "Reporting Manager", "status": "Pending", "priority": "High"}
        ]
    elif orientation_status == "Pending HR Review":
        orientation_plan = [
            {"step": 1, "session": "HR Verification", "department": "Human Resources", "status": "Required", "priority": "High"},
            {"step": 2, "session": "Review AI Recommendation", "department": "Human Resources", "status": "Pending", "priority": "High"},
            {"step": 3, "session": "Schedule Orientation", "department": "Human Resources", "status": "Waiting for Approval", "priority": "Medium"}
        ]
    elif orientation_status == "Awaiting Better Document":
        orientation_plan = [
            {"step": 1, "session": "Upload Clear Document", "department": "Candidate", "status": "Pending", "priority": "High"},
            {"step": 2, "session": "Restart Document Verification", "department": "AI Validation", "status": "Pending", "priority": "Medium"}
        ]
    else:
        orientation_plan = [
            {"step": 1, "session": "Upload Correct Document", "department": "Candidate", "status": "Blocked", "priority": "High"},
            {"step": 2, "session": "Restart Identity Verification", "department": "AI Validation", "status": "Pending", "priority": "Medium"}
        ]

    # ---------------------------------------
    # Integrate ZY / XAI Recommendation Engine
    # ---------------------------------------

    xai_data = generate_xai_explanation(
        module_type="orientation",
        predicted_class=predicted_class,
        confidence=confidence,
        expected_type=expected_type,
        integrity=integrity,
        ocr_success=ocr_success,
        candidate_data=candidate_data
    )

    # ---------------------------------------
    # AI Recommendation Summary
    # ---------------------------------------

    explanation = (
        f"The uploaded document was classified as '{predicted_class.replace('_', ' ')}' "
        f"with a confidence of {confidence:.2%}. The document category "
        f"{'matches' if matched else 'does not match'} the expected category. "
        f"Integrity verification {'passed' if integrity else 'failed'}, "
        f"and OCR extraction {'was successful' if ocr_success else 'failed'}. "
        f"Based on these verification results, the employee orientation status is '{orientation_status}'. "
        f"{recommendation}"
    )

    # ---------------------------------------
    # Final Output
    # ---------------------------------------

    return {
        "status": "success",
        "orientationStatus": orientation_status,
        "risk": risk,
        "score": score,
        "confidence": confidence,
        "detectedDocument": predicted_class,
        "detectedCategory": detected_category,
        "expectedCategory": expected_type,
        "matched": matched,
        "recommendation": recommendation,
        "aiRecommendation": orientation_recommendation,
        "reasoning": reasoning,
        "orientationPlan": orientation_plan,
        "summary": explanation,
        "candidateInsights": xai_data  # ZY / XAI Insights output for HR Recommendations
    }