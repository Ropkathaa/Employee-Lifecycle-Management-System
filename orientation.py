# ==========================================================
# AI Orientation Planning
# Employee Lifecycle Management System
# ==========================================================

from xai import DOCUMENT_CATEGORY_MAP


def generate_orientation(
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

    orientation_status = ""

    orientation_plan = []

    # ---------------------------------------
    # AI Decision Engine
    # ---------------------------------------

    if not integrity:

        orientation_status = "Orientation Blocked"

        risk = "High"

        recommendation = (
            "Orientation cannot begin until document verification succeeds."
        )

        reasoning.append(
            "Document integrity verification failed."
        )

    elif not matched:

        orientation_status = "Awaiting Correct Document"

        risk = "High"

        recommendation = (
            "Upload the correct employee document before scheduling orientation."
        )

        reasoning.append(
            "Document category mismatch detected."
        )

    elif confidence < 0.70:

        orientation_status = "Pending HR Review"

        risk = "Medium"

        recommendation = (
            "Orientation will be scheduled after HR verification."
        )

        reasoning.append(
            "AI confidence is below the acceptable threshold."
        )

    elif not ocr_success:

        orientation_status = "Awaiting Better Document"

        risk = "Medium"

        recommendation = (
            "Orientation is postponed until employee information can be extracted."
        )

        reasoning.append(
            "OCR extraction was incomplete."
        )

    else:

        orientation_status = "Orientation Ready"

        risk = "Low"

        recommendation = (
            "Employee is eligible for AI-assisted orientation."
        )

        reasoning.extend([

            "Identity verification completed successfully.",

            "Document integrity verification passed.",

            "High AI classification confidence.",

            "OCR extracted employee information successfully."

        ])

    # ---------------------------------------
    # Personalized Orientation Plan
    # ---------------------------------------

    if orientation_status == "Orientation Ready":

        orientation_plan = [

            {
                "session": "Welcome & Company Introduction",
                "status": "Scheduled"
            },

            {
                "session": "HR Policies and Employee Benefits",
                "status": "Scheduled"
            },

            {
                "session": "Information Security & Cyber Awareness",
                "status": "Scheduled"
            },

            {
                "session": "Code of Conduct & Workplace Ethics",
                "status": "Scheduled"
            },

            {
                "session": "Department Introduction",
                "status": "Scheduled"
            },

            {
                "session": "Manager Meet & Goal Setting",
                "status": "Pending"
            }

        ]

    elif orientation_status == "Pending HR Review":

        orientation_plan = [

            {
                "session": "HR Verification",
                "status": "Required"
            }

        ]

    else:

        orientation_plan = [

            {
                "session": "Orientation cannot be scheduled",
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
        f"Based on document verification, integrity validation, "
        f"category matching and OCR quality, "
        f"the employee orientation status is "
        f"'{orientation_status}'. "
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

        "reasoning": reasoning,

        "orientationPlan": orientation_plan,

        "summary": explanation

    }