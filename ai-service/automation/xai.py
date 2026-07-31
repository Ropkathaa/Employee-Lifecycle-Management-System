# ==========================================================
# Explainable AI (XAI) & Recommendation Engine
# Employee Lifecycle Management System
# ==========================================================

# ----------------------------------------------------------
# Shared AI Configuration Thresholds & Weights
# ----------------------------------------------------------

HIGH_CONFIDENCE = 0.90
MEDIUM_CONFIDENCE = 0.75
LOW_CONFIDENCE = 0.60

DOCUMENT_MATCH_WEIGHT = 2
INTEGRITY_WEIGHT = 2
OCR_WEIGHT = 1

# ----------------------------------------------------------
# Business Document Categories
# ----------------------------------------------------------

DOCUMENT_CATEGORY_MAP = {
    "AADHAAR": "Government ID",
    "PAN": "Government ID",
    "VOTER_ID": "Government ID",
    "DRIVING_LICENSE": "Government ID",
    "PASSPORT": "Passport",
    "RESUME": "CV/Resume",
    "CV": "CV/Resume",
    "EXPERIENCE_LETTER": "Experience Letter",
    "ACADEMIC_CERTIFICATE": "Academic Certificate"
}


def explain_result(predicted_class, confidence, expected_type):
    """
    Evaluates classification outputs and provides business verification logic.
    """
    predicted_class = str(predicted_class or "").strip().upper()
    expected_type = str(expected_type or "").strip()
    confidence = float(confidence or 0)

    detected_category = DOCUMENT_CATEGORY_MAP.get(
        predicted_class,
        predicted_class
    )

    matched = (
        detected_category.lower() == expected_type.lower()
    )

    decision = "VALID" if matched else "INVALID"
    score = int(confidence * 100)
    reasoning = []

    reasoning.append(f"Detected document category: {detected_category}.")
    reasoning.append(f"Expected document category: {expected_type}.")
    reasoning.append(f"Classification confidence: {confidence:.2%}.")

    if matched:
        reasoning.append("Document category matches the expected business category.")
        if confidence >= HIGH_CONFIDENCE:
            ai_recommendation = {
                "decision": "Accept",
                "confidenceLevel": "High",
                "priority": "Normal"
            }
        elif confidence >= MEDIUM_CONFIDENCE:
            ai_recommendation = {
                "decision": "Review",
                "confidenceLevel": "Medium",
                "priority": "Medium"
            }
        else:
            ai_recommendation = {
                "decision": "Manual Verification",
                "confidenceLevel": "Low",
                "priority": "High"
            }
    else:
        reasoning.append("Document category does not match the expected business category.")
        ai_recommendation = {
            "decision": "Reject",
            "confidenceLevel": "Low",
            "priority": "High"
        }

    recommendation = ""
    if detected_category == "Government ID":
        recommendation = "Suitable for employee identity verification."
    elif detected_category == "CV/Resume":
        recommendation = "Suitable for candidate profile evaluation."
    elif detected_category == "Experience Letter":
        recommendation = "Suitable for employment verification."
    elif detected_category == "Academic Certificate":
        recommendation = "Suitable for educational qualification verification."
    elif detected_category == "Passport":
        recommendation = "Suitable for international identity verification."
    else:
        recommendation = "No business recommendation available."

    reasoning.append(recommendation)

    details = [
        f"Detected Document: {predicted_class.replace('_', ' ')}",
        f"Business Category: {detected_category}",
        f"Expected Category: {expected_type}",
        f"Classification Confidence: {confidence:.2%}",
        f"Decision: {decision}",
        f"Recommendation: {recommendation}"
    ]

    explanation = (
        f"The uploaded document was classified as '{predicted_class.replace('_', ' ')}' "
        f"with a confidence of {confidence:.2%}. The detected business category "
        f"{'matches' if matched else 'does not match'} the expected category. "
        f"The AI recommendation is '{ai_recommendation['decision']}'. "
        f"{recommendation}"
    )

    return {
        "status": "success",
        "decision": decision,
        "score": score,
        "confidence": confidence,
        "detectedDocument": predicted_class,
        "detectedCategory": detected_category,
        "expectedCategory": expected_type,
        "matched": matched,
        "aiRecommendation": ai_recommendation,
        "reasoning": reasoning,
        "details": details,
        "summary": " | ".join(details),
        "explanation": explanation
    }


def generate_xai_explanation(
    module_type,
    predicted_class,
    confidence,
    expected_type,
    integrity=True,
    ocr_success=True,
    candidate_data=None
):
    """
    Generates module-specific Explainable AI (XAI) insights and candidate breakdown
    for Onboarding, Checklist Provisioning, and Orientation modules.
    """
    predicted_class = str(predicted_class or "").strip().upper()
    expected_type = str(expected_type or "").strip()
    confidence = float(confidence or 0)

    detected_category = DOCUMENT_CATEGORY_MAP.get(
        predicted_class,
        predicted_class
    )
    matched = (detected_category.lower() == expected_type.lower())

    key_factors = []

    # Evaluate Factors
    if matched:
        key_factors.append({
            "factor": "Document Type Match",
            "status": "Pass",
            "impact": "+Positive",
            "description": f"Document category '{detected_category}' matches expected '{expected_type}'."
        })
    else:
        key_factors.append({
            "factor": "Document Type Mismatch",
            "status": "Fail",
            "impact": "-Negative",
            "description": f"Detected category '{detected_category}' does not match expected '{expected_type}'."
        })

    if integrity:
        key_factors.append({
            "factor": "Document Integrity",
            "status": "Pass",
            "impact": "+Positive",
            "description": "Document digital signature and structural integrity verified."
        })
    else:
        key_factors.append({
            "factor": "Document Integrity",
            "status": "Fail",
            "impact": "-Negative",
            "description": "Document integrity check failed. Potential modification detected."
        })

    if ocr_success:
        key_factors.append({
            "factor": "OCR Field Extraction",
            "status": "Pass",
            "impact": "+Positive",
            "description": "Key textual fields successfully extracted from document."
        })
    else:
        key_factors.append({
            "factor": "OCR Field Extraction",
            "status": "Warning",
            "impact": "-Negative",
            "description": "OCR extraction incomplete due to low image clarity."
        })

    # Confidence factor
    if confidence >= HIGH_CONFIDENCE:
        conf_impact = "+Positive"
        conf_status = "High"
    elif confidence >= MEDIUM_CONFIDENCE:
        conf_impact = "Neutral"
        conf_status = "Medium"
    else:
        conf_impact = "-Negative"
        conf_status = "Low"

    key_factors.append({
        "factor": "AI Model Confidence",
        "status": conf_status,
        "impact": conf_impact,
        "description": f"Model classified document with {confidence:.2%} certainty."
    })

    # Formulate Module-Specific Recommendations & Action Items
    action_items = []
    if not integrity or not matched:
        next_step = "Re-upload required: Ask candidate to submit valid document."
        action_items.append(next_step)
    elif confidence < MEDIUM_CONFIDENCE or not ocr_success:
        next_step = "Manual review required by HR operator before proceeding."
        action_items.append(next_step)
    else:
        if module_type == "onboarding":
            next_step = "Proceed to automated onboarding verification."
        elif module_type == "checklist":
            next_step = "Proceed with IT account and asset provisioning."
        elif module_type == "orientation":
            next_step = "Schedule AI-assisted orientation sessions."
        else:
            next_step = "Proceed to next workflow stage."
        action_items.append(next_step)

    c_data = candidate_data or {}

    return {
        "module": module_type,
        "candidate": {
            "name": c_data.get("name", "N/A"),
            "email": c_data.get("email", "N/A"),
            "department": c_data.get("department", "General"),
            "role": c_data.get("role", "Employee")
        },
        "evaluationSummary": {
            "matched": matched,
            "integrityPassed": integrity,
            "ocrSuccess": ocr_success,
            "confidenceScore": f"{confidence:.2%}"
        },
        "keyFactors": key_factors,
        "suggestedActions": action_items
    }