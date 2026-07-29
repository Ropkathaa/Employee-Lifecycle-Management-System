import re


class RuleEngine:
    """
    Business rule validation engine.
    Validates whether the extracted document content
    satisfies expected rules for the declared document type.
    """

    def __init__(self):

        self.required_keywords = {

            "AADHAAR": [
                "government of india",
                "aadhaar"
            ],

            "PAN": [
                "income tax",
                "permanent account number"
            ],

            "PASSPORT": [
                "passport"
            ],

            "DRIVING_LICENSE": [
                "driving",
                "licence"
            ],

            "VOTER_ID": [
                "election"
            ],

            "RESUME": [
                "education",
                "experience"
            ]
        }

    def validate(
        self,
        declared_type,
        predicted_type,
        text
    ):

        result = {
            "status": "success",
            "passed": True,
            "score": 1.0,
            "issues": []
        }

        if text is None:
            text = ""

        text = text.lower()

        # -----------------------------
        # Document Type Match
        # -----------------------------

        if (
            declared_type
            and predicted_type
            and declared_type.upper() != "UNKNOWN"
            and predicted_type.upper() != "UNKNOWN"
            and declared_type.upper() != predicted_type.upper()
        ):

            result["passed"] = False

            result["issues"].append(
                f"Expected {declared_type}, detected {predicted_type}."
            )

            result["score"] -= 0.40

        # -----------------------------
        # Keyword Validation
        # -----------------------------

        keywords = self.required_keywords.get(
            declared_type.upper(),
            []
        )

        missing = []

        for keyword in keywords:

            if keyword.lower() not in text:
                missing.append(keyword)

        if missing:

            result["passed"] = False

            result["issues"].append(
                "Missing keywords: " +
                ", ".join(missing)
            )

            deduction = min(
                0.40,
                0.10 * len(missing)
            )

            result["score"] -= deduction

        # -----------------------------
        # Empty OCR
        # -----------------------------

        if len(text.strip()) < 20:

            result["passed"] = False

            result["issues"].append(
                "Very little readable text detected."
            )

            result["score"] -= 0.30

        # -----------------------------
        # Number Density Check
        # -----------------------------

        numbers = re.findall(r"\d", text)

        if len(numbers) == 0:

            result["issues"].append(
                "No numeric information detected."
            )

            result["score"] -= 0.10

        # -----------------------------
        # Clamp
        # -----------------------------

        result["score"] = round(
            max(
                0.0,
                min(1.0, result["score"])
            ),
            3
        )

        return result