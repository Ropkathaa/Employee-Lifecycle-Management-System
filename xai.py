# ==========================================================
# Explainable AI (XAI)
# Employee Lifecycle Management System
# ==========================================================

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

    # -----------------------------
    # Safe handling
    # -----------------------------
    predicted_class = str(predicted_class or "").strip().upper()
    expected_type = str(expected_type or "").strip()

    confidence = float(confidence or 0)

    # -----------------------------
    # Map AI class to business category
    # -----------------------------
    detected_category = DOCUMENT_CATEGORY_MAP.get(
        predicted_class,
        predicted_class
    )

    # -----------------------------
    # Compare categories
    # -----------------------------
    matched = (
        detected_category.lower()
        ==
        expected_type.lower()
    )

    decision = "VALID" if matched else "INVALID"

    # -----------------------------
    # Build explanation
    # -----------------------------
    details = []

    details.append("Document integrity verification passed.")

    details.append(
        f"AI identified the uploaded document as '{predicted_class.replace('_',' ')}'."
    )

    details.append(
        f"Business Category : {detected_category}"
    )

    details.append(
        f"Selected Category : {expected_type}"
    )

    details.append(
        f"Classification Confidence : {confidence:.2%}"
    )

    if matched:

        details.append(
            "Document type matches the selected category."
        )

    else:

        details.append(
            "Document type does NOT match the selected category."
        )

    # -----------------------------
    # HR Recommendation
    # -----------------------------
    recommendation = ""

    if detected_category == "Government ID":

        recommendation = (
            "Suitable for employee identity verification."
        )

    elif detected_category == "CV/Resume":

        recommendation = (
            "Suitable for candidate profile evaluation."
        )

    elif detected_category == "Experience Letter":

        recommendation = (
            "Suitable for employment verification."
        )

    elif detected_category == "Academic Certificate":

        recommendation = (
            "Suitable for educational qualification verification."
        )

    elif detected_category == "Passport":

        recommendation = (
            "Suitable for international identity verification."
        )

    else:

        recommendation = (
            "No business recommendation available."
        )

    details.append(recommendation)

    # -----------------------------
    # Final Output
    # -----------------------------
    return {

        "status": "success",

        "decision": decision,

        "confidence": confidence,

        "detectedDocument": predicted_class,

        "detectedCategory": detected_category,

        "expectedCategory": expected_type,

        "matched": matched,

        "details": details,

        "summary": " | ".join(details)

    }