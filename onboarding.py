# ==========================================================
# AI Onboarding Automation
# Employee Lifecycle Management System
# ==========================================================

from xai import DOCUMENT_CATEGORY_MAP


def generate_onboarding(
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

    # ---------------------------------------
    # AI Decision Engine
    # ---------------------------------------

    status = ""
    risk = ""
    score = int(confidence * 100)

    reasoning = []

    next_steps = []

    recommendation = ""

    # ---------------------------------------
    # AI Rules
    # ---------------------------------------

    if not integrity:

        status = "On Hold"

        risk = "High"

        reasoning.append(
            "Document integrity verification failed."
        )

        recommendation = (
            "Employee onboarding should not begin until a valid document is uploaded."
        )

    elif not matched:

        status = "Document Mismatch"

        risk = "High"

        reasoning.append(
            "Uploaded document does not match the selected document category."
        )

        recommendation = (
            "Request the employee to upload the correct document."
        )

    elif confidence < 0.70:

        status = "Manual HR Review"

        risk = "Medium"

        reasoning.append(
            "AI confidence is below the acceptable threshold."
        )

        recommendation = (
            "HR should manually verify the uploaded document."
        )

    elif not ocr_success:

        status = "Re-upload Required"

        risk = "Medium"

        reasoning.append(
            "OCR could not extract sufficient information."
        )

        recommendation = (
            "Please upload a clearer image."
        )

    else:

        status = "Ready for Onboarding"

        risk = "Low"

        reasoning.extend([

            "Identity document verified successfully.",

            "AI classification confidence is high.",

            "Document integrity verification passed.",

            "OCR extraction completed successfully."

        ])

        recommendation = (
            "Employee can proceed with the onboarding workflow."
        )

    # ---------------------------------------
    # Intelligent Workflow
    # ---------------------------------------

    if status == "Ready for Onboarding":

        next_steps = [

            {
                "task": "Generate Employee ID",
                "status": "Ready"
            },

            {
                "task": "Create Employee Profile",
                "status": "Ready"
            },

            {
                "task": "Payroll Registration",
                "status": "Ready"
            },

            {
                "task": "Background Verification",
                "status": "Ready"
            },

            {
                "task": "Manager Approval",
                "status": "Pending"
            }

        ]

    elif status == "Manual HR Review":

        next_steps = [

            {
                "task": "HR Verification",
                "status": "Required"
            },

            {
                "task": "Revalidate Document",
                "status": "Pending"
            }

        ]

    elif status == "Re-upload Required":

        next_steps = [

            {
                "task": "Upload Clear Document",
                "status": "Pending"
            }

        ]

    else:

        next_steps = [

            {
                "task": "Upload Correct Document",
                "status": "Pending"
            }

        ]

    # ---------------------------------------
    # AI Explanation
    # ---------------------------------------

    explanation = (

        f"The AI detected the uploaded document as "
        f"'{predicted_class.replace('_',' ')}' "

        f"with {confidence:.2%} confidence. "

        f"Based on document verification, integrity validation, "

        f"category matching and OCR quality, "

        f"the employee onboarding status is "

        f"'{status}'. "

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

        "reasoning": reasoning,

        "nextSteps": next_steps,

        "summary": explanation

    }