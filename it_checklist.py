# ==========================================================
# AI IT Provisioning Automation
# Employee Lifecycle Management System
# ==========================================================

from xai import DOCUMENT_CATEGORY_MAP


def generate_it_checklist(
    predicted_class,
    confidence,
    expected_type,
    integrity=True,
    ocr_success=True
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

    score = int(confidence * 100)

    reasoning = []

    recommendation = ""

    risk = ""

    provisioning_status = ""

    resources = []

    # ---------------------------------------
    # AI Decision Engine
    # ---------------------------------------

    if not integrity:

        provisioning_status = "Provisioning Blocked"

        risk = "High"

        recommendation = (
            "IT resources cannot be assigned because document integrity verification failed."
        )

        reasoning.append(
            "Identity verification failed."
        )

    elif not matched:

        provisioning_status = "Provisioning Blocked"

        risk = "High"

        recommendation = (
            "Uploaded document does not match the selected category."
        )

        reasoning.append(
            "Document mismatch detected."
        )

    elif confidence < 0.70:

        provisioning_status = "Pending HR Approval"

        risk = "Medium"

        recommendation = (
            "IT provisioning will begin after manual HR verification."
        )

        reasoning.append(
            "Classification confidence is below threshold."
        )

    elif not ocr_success:

        provisioning_status = "Awaiting Better Document"

        risk = "Medium"

        recommendation = (
            "OCR extraction failed. Clear document required."
        )

        reasoning.append(
            "Employee information could not be extracted."
        )

    else:

        provisioning_status = "Auto Approved"

        risk = "Low"

        recommendation = (
            "Employee identity verified successfully. IT provisioning can begin."
        )

        reasoning.extend([

            "Identity verification successful.",

            "Document integrity passed.",

            "AI confidence is high.",

            "OCR completed successfully."

        ])

    # ---------------------------------------
    # Intelligent Resource Allocation
    # ---------------------------------------

    if provisioning_status == "Auto Approved":

        resources = [

            {
                "resource": "Corporate Email",
                "status": "Approved"
            },

            {
                "resource": "HRMS Portal",
                "status": "Approved"
            },

            {
                "resource": "Microsoft Teams",
                "status": "Approved"
            },

            {
                "resource": "VPN Access",
                "status": "Pending Manager Approval"
            },

            {
                "resource": "Git Repository",
                "status": "Pending Manager Approval"
            },

            {
                "resource": "Laptop Allocation",
                "status": "Ready"
            }

        ]

    elif provisioning_status == "Pending HR Approval":

        resources = [

            {
                "resource": "Corporate Email",
                "status": "Waiting"
            },

            {
                "resource": "HR Verification",
                "status": "Required"
            }

        ]

    else:

        resources = [

            {
                "resource": "No IT Resources Assigned",
                "status": "Blocked"
            }

        ]

    # ---------------------------------------
    # AI Explanation
    # ---------------------------------------

    explanation = (

        f"The AI identified the uploaded document as "

        f"'{predicted_class.replace('_',' ')}' "

        f"with {confidence:.2%} confidence. "

        f"Based on document verification, identity validation, "

        f"category matching and OCR quality, "

        f"the IT provisioning status is "

        f"'{provisioning_status}'. "

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

        "reasoning": reasoning,

        "resources": resources,

        "summary": explanation

    }