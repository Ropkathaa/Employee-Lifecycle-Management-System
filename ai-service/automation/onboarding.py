# ==========================================================
# AI Onboarding Automation
# Employee Lifecycle Management System
# ==========================================================

from automation.xai import DOCUMENT_CATEGORY_MAP, generate_xai_explanation

def generate_onboarding(
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

    status = ""
    risk = ""
    score = int(confidence * 100)
    reasoning = []
    next_steps = []
    recommendation = ""

    ai_recommendation = {
        "decision": "Pending",
        "confidenceLevel": "Unknown",
        "priority": "Normal",
        "requiresHRReview": True
    }

    # ---------------------------------------
    # AI Rules
    # ---------------------------------------

    if not integrity:
        status = "On Hold"
        risk = "High"
        score = max(score - (INTEGRITY_WEIGHT * 15), 0)
        reasoning.extend([
            "Document integrity verification failed.",
            "The uploaded document may have been altered or corrupted.",
            "A valid document is required before onboarding can begin."
        ])
        recommendation = (
            "Employee onboarding should not begin until a valid document is uploaded."
        )
        ai_recommendation = {
            "decision": "Do Not Proceed",
            "confidenceLevel": "Low",
            "priority": "High",
            "requiresHRReview": True
        }

    elif not matched:
        status = "Document Mismatch"
        risk = "High"
        score = max(score - (DOCUMENT_MATCH_WEIGHT * 15), 0)
        reasoning.extend([
            "Uploaded document does not match the selected document category.",
            "Document verification cannot be completed.",
            "A correct document should be uploaded."
        ])
        recommendation = (
            "Request the employee to upload the correct document."
        )
        ai_recommendation = {
            "decision": "Do Not Proceed",
            "confidenceLevel": "Low",
            "priority": "High",
            "requiresHRReview": True
        }

    elif confidence < MEDIUM_CONFIDENCE:
        status = "Manual HR Review"
        risk = "Medium"
        reasoning.extend([
            "AI confidence is below the acceptable threshold.",
            "Automated verification is inconclusive.",
            "Manual HR verification is recommended."
        ])
        recommendation = (
            "HR should manually verify the uploaded document."
        )
        ai_recommendation = {
            "decision": "Manual Review",
            "confidenceLevel": "Medium",
            "priority": "Medium",
            "requiresHRReview": True
        }

    elif not ocr_success:
        status = "Re-upload Required"
        risk = "Medium"
        score = max(score - (OCR_WEIGHT * 10), 0)
        reasoning.extend([
            "OCR could not extract sufficient information.",
            "The uploaded image quality is insufficient.",
            "A clearer document image is required."
        ])
        recommendation = (
            "Please upload a clearer image."
        )
        ai_recommendation = {
            "decision": "Re-upload Required",
            "confidenceLevel": "Medium",
            "priority": "Medium",
            "requiresHRReview": False
        }

    else:
        status = "Ready for Onboarding"
        risk = "Low"
        score = min(
            score +
            (DOCUMENT_MATCH_WEIGHT * 2) +
            (INTEGRITY_WEIGHT * 2) +
            OCR_WEIGHT,
            100
        )
        reasoning.extend([
            "Document category successfully matched.",
            "Identity verification completed successfully.",
            "Document integrity verification passed.",
            "OCR extracted the required information successfully.",
            "AI confidence exceeded the recommended acceptance threshold."
        ])
        recommendation = (
            "Employee can proceed with the onboarding workflow."
        )
        ai_recommendation = {
            "decision": "Proceed",
            "confidenceLevel": "High",
            "priority": "Normal",
            "requiresHRReview": False
        }

    # ---------------------------------------
    # Intelligent Workflow
    # ---------------------------------------

    if status == "Ready for Onboarding":
        next_steps = [
            {"step": 1, "task": "Generate Employee ID", "department": "HR", "status": "Ready", "priority": "High"},
            {"step": 2, "task": "Create Employee Profile", "department": "HR", "status": "Ready", "priority": "High"},
            {"step": 3, "task": "Assign Department", "department": "HR", "status": "Ready", "priority": "Medium"},
            {"step": 4, "task": "Generate Official Email", "department": "IT", "status": "Ready", "priority": "Medium"},
            {"step": 5, "task": "Payroll Registration", "department": "Finance", "status": "Ready", "priority": "High"},
            {"step": 6, "task": "Background Verification", "department": "Compliance", "status": "Ready", "priority": "High"},
            {"step": 7, "task": "Manager Approval", "department": "Reporting Manager", "status": "Pending", "priority": "Medium"}
        ]
    elif status == "Manual HR Review":
        next_steps = [
            {"step": 1, "task": "HR Verification", "department": "HR", "status": "Required", "priority": "High"},
            {"step": 2, "task": "Review AI Recommendation", "department": "HR", "status": "Pending", "priority": "High"},
            {"step": 3, "task": "Revalidate Document", "department": "AI Validation", "status": "Pending", "priority": "Medium"}
        ]
    elif status == "Re-upload Required":
        next_steps = [
            {"step": 1, "task": "Upload Clear Document", "department": "Candidate", "status": "Pending", "priority": "High"},
            {"step": 2, "task": "Restart Document Validation", "department": "AI Validation", "status": "Pending", "priority": "Medium"}
        ]
    else:
        next_steps = [
            {"step": 1, "task": "Upload Correct Document", "department": "Candidate", "status": "Pending", "priority": "High"},
            {"step": 2, "task": "Restart Verification", "department": "AI Validation", "status": "Pending", "priority": "Medium"}
        ]

    # ---------------------------------------
    # Integrate ZY / XAI Recommendation Engine
    # ---------------------------------------

    xai_data = generate_xai_explanation(
        module_type="onboarding",
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
        f"Based on these verification results, the onboarding status is '{status}'. "
        f"{recommendation}"
    )

    # ---------------------------------------
    # Final Output
    # ---------------------------------------

    return {
        "status": "success",
        "onboardingStatus": status,
        "risk": risk,
        "score": score,
        "detectedDocument": predicted_class,
        "detectedCategory": detected_category,
        "expectedCategory": expected_type,
        "confidence": confidence,
        "matched": matched,
        "recommendation": recommendation,
        "aiRecommendation": ai_recommendation,
        "reasoning": reasoning,
        "nextSteps": next_steps,
        "summary": explanation,
        "candidateInsights": xai_data  # ZY / XAI Insights output for HR Recommendations
    }