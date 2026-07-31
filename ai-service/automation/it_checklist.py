# ==========================================================
# AI IT Provisioning Automation
# Employee Lifecycle Management System
# ==========================================================

from automation.xai import DOCUMENT_CATEGORY_MAP, generate_xai_explanation


def generate_it_checklist(
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
    provisioning_status = ""
    resources = []

    it_recommendation = {
        "decision": "Pending",
        "confidenceLevel": "Unknown",
        "priority": "Normal",
        "requiresITApproval": True
    }

    if not integrity:
        provisioning_status = "Provisioning Blocked"
        risk = "High"
        score = max(score - (INTEGRITY_WEIGHT * 15), 0)
        reasoning.extend([
            "Document integrity verification failed.",
            "The uploaded document may have been modified or is invalid.",
            "IT resource provisioning cannot proceed until a valid document is submitted."
        ])
        recommendation = (
            "IT resources cannot be assigned because document integrity verification failed."
        )
        it_recommendation = {
            "decision": "Do Not Provision",
            "confidenceLevel": "Low",
            "priority": "High",
            "requiresITApproval": True
        }

    elif not matched:
        provisioning_status = "Provisioning Blocked"
        risk = "High"
        score = max(score - (DOCUMENT_MATCH_WEIGHT * 15), 0)
        reasoning.extend([
            "Uploaded document does not match the selected document category.",
            "Employee identity verification could not be completed.",
            "Correct document submission is required."
        ])
        recommendation = (
            "Uploaded document does not match the selected category."
        )
        it_recommendation = {
            "decision": "Do Not Provision",
            "confidenceLevel": "Low",
            "priority": "High",
            "requiresITApproval": True
        }

    elif confidence < MEDIUM_CONFIDENCE:
        provisioning_status = "Pending HR Approval"
        risk = "Medium"
        reasoning.extend([
            "AI confidence is below the recommended threshold.",
            "Automated verification is inconclusive.",
            "HR verification is required before IT provisioning."
        ])
        recommendation = (
            "IT provisioning will begin after manual HR verification."
        )
        it_recommendation = {
            "decision": "Manual Review",
            "confidenceLevel": "Medium",
            "priority": "Medium",
            "requiresITApproval": True
        }

    elif not ocr_success:
        provisioning_status = "Awaiting Better Document"
        risk = "Medium"
        score = max(score - (OCR_WEIGHT * 10), 0)
        reasoning.extend([
            "OCR could not extract sufficient employee information.",
            "Document image quality is insufficient.",
            "A clearer document should be uploaded."
        ])
        recommendation = (
            "OCR extraction failed. A clearer document is required."
        )
        it_recommendation = {
            "decision": "Re-upload Required",
            "confidenceLevel": "Medium",
            "priority": "Medium",
            "requiresITApproval": False
        }

    else:
        provisioning_status = "Auto Approved"
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
            "Employee identity verified successfully. IT provisioning can begin."
        )
        it_recommendation = {
            "decision": "Provision Resources",
            "confidenceLevel": "High",
            "priority": "Normal",
            "requiresITApproval": False
        }

    # ---------------------------------------
    # Intelligent Resource Allocation
    # ---------------------------------------

    if provisioning_status == "Auto Approved":
        resources = [
            {"step": 1, "resource": "Corporate Email", "department": "IT", "status": "Approved", "priority": "High"},
            {"step": 2, "resource": "HRMS Portal", "department": "HR", "status": "Approved", "priority": "High"},
            {"step": 3, "resource": "Microsoft Teams", "department": "IT", "status": "Approved", "priority": "Medium"},
            {"step": 4, "resource": "Employee Identity Card", "department": "Administration", "status": "Ready", "priority": "Medium"},
            {"step": 5, "resource": "Laptop Allocation", "department": "IT Asset Management", "status": "Ready", "priority": "High"},
            {"step": 6, "resource": "VPN Access", "department": "Cyber Security", "status": "Pending Manager Approval", "priority": "Medium"},
            {"step": 7, "resource": "Git Repository", "department": "Development Team", "status": "Pending Manager Approval", "priority": "Medium"}
        ]
    elif provisioning_status == "Pending HR Approval":
        resources = [
            {"step": 1, "resource": "HR Verification", "department": "HR", "status": "Required", "priority": "High"},
            {"step": 2, "resource": "Review AI Recommendation", "department": "HR", "status": "Pending", "priority": "High"},
            {"step": 3, "resource": "Begin IT Provisioning", "department": "IT", "status": "Waiting for HR Approval", "priority": "Medium"}
        ]
    elif provisioning_status == "Awaiting Better Document":
        resources = [
            {"step": 1, "resource": "Upload Clear Document", "department": "Candidate", "status": "Pending", "priority": "High"},
            {"step": 2, "resource": "Restart Document Verification", "department": "AI Validation", "status": "Pending", "priority": "Medium"}
        ]
    else:
        resources = [
            {"step": 1, "resource": "Correct Document Required", "department": "Candidate", "status": "Blocked", "priority": "High"},
            {"step": 2, "resource": "Restart Identity Verification", "department": "AI Validation", "status": "Pending", "priority": "Medium"}
        ]

    # ---------------------------------------
    # Integrate ZY / XAI Recommendation Engine
    # ---------------------------------------

    xai_data = generate_xai_explanation(
        module_type="checklist",
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
        f"Based on these verification results, the IT provisioning status is '{provisioning_status}'. "
        f"{recommendation}"
    )

    # ---------------------------------------
    # Final Output
    # ---------------------------------------

    return {
        "status": "success",
        "provisioningStatus": provisioning_status,
        "risk": risk,
        "score": score,
        "confidence": confidence,
        "detectedDocument": predicted_class,
        "detectedCategory": detected_category,
        "expectedCategory": expected_type,
        "matched": matched,
        "recommendation": recommendation,
        "aiRecommendation": it_recommendation,
        "reasoning": reasoning,
        "resources": resources,
        "summary": explanation,
        "candidateInsights": xai_data  # ZY / XAI Insights output for HR Recommendations
    }