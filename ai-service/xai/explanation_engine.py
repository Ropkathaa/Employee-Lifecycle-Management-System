class ExplanationEngine:
    """
    Generates human-readable explanations for document validation.
    This module can later be upgraded to SHAP/LIME/Grad-CAM explanations.
    """

    def __init__(self):
        pass

    def explain(
        self,
        integrity_result,
        classification_result,
        rule_result,
        robustness_result
    ):

        explanation = []

        # -----------------------------
        # Integrity
        # -----------------------------

        if integrity_result["validationStatus"] == "VALID":
            explanation.append(
                "✓ File integrity verification passed."
            )
        else:
            explanation.append(
                "✗ File integrity verification failed."
            )

        # -----------------------------
        # Classification
        # -----------------------------

        predicted = classification_result.get(
            "predictedClass",
            "UNKNOWN"
        )

        confidence = classification_result.get(
            "confidence",
            0
        )

        explanation.append(
            f"Detected document type: {predicted} "
            f"(confidence {confidence:.2f})."
        )

        # -----------------------------
        # Rule Validation
        # -----------------------------

        if rule_result.get("passed", False):

            explanation.append(
                "✓ Business rules satisfied."
            )

        else:

            explanation.append(
                "✗ Business rule validation failed."
            )

            for issue in rule_result.get(
                "issues",
                []
            ):
                explanation.append(
                    f"- {issue}"
                )

        # -----------------------------
        # Robustness
        # -----------------------------

        risk = robustness_result.get(
            "riskLevel",
            "UNKNOWN"
        )

        score = robustness_result.get(
            "robustnessScore",
            0
        )

        explanation.append(
            f"Robustness score: {score:.2f} "
            f"({risk} risk)."
        )

        anomalies = robustness_result.get(
            "anomalies",
            []
        )

        if anomalies:

            explanation.append(
                "Detected anomalies:"
            )

            for anomaly in anomalies:

                explanation.append(
                    f"- {anomaly}"
                )

        # -----------------------------
        # Final Decision
        # -----------------------------

        if (
            integrity_result["validationStatus"] == "VALID"
            and rule_result.get("passed", False)
            and score >= 0.50
        ):

            decision = "VALID"

        else:

            decision = "INVALID"

        return {
            "status": "success",
            "decision": decision,
            "summary": " ".join(explanation),
            "details": explanation
        }