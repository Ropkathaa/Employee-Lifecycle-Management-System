import math
import re


class AnomalyDetector:
    """
    Detects suspicious or abnormal documents.
    Produces a robustness score that can later be
    replaced by an AI-based detector.
    """

    def __init__(self):
        pass

    def analyze(self, text):

        result = {
            "status": "success",
            "robustnessScore": 1.0,
            "riskLevel": "LOW",
            "anomalies": []
        }

        if text is None:
            text = ""

        text = text.strip()

        # -----------------------------
        # Empty OCR
        # -----------------------------

        if len(text) == 0:

            result["robustnessScore"] = 0.0
            result["riskLevel"] = "HIGH"

            result["anomalies"].append(
                "No readable text detected."
            )

            return result

        # -----------------------------
        # Very Short OCR
        # -----------------------------

        if len(text) < 30:

            result["robustnessScore"] -= 0.20

            result["anomalies"].append(
                "Extremely short extracted text."
            )

        # -----------------------------
        # Character Diversity
        # -----------------------------

        unique = len(set(text))

        diversity = unique / max(len(text), 1)

        if diversity < 0.10:

            result["robustnessScore"] -= 0.15

            result["anomalies"].append(
                "Very low character diversity."
            )

        # -----------------------------
        # Excessive Repetition
        # -----------------------------

        words = re.findall(r"\w+", text.lower())

        if len(words) > 10:

            repetition = max(
                words.count(word)
                for word in set(words)
            ) / len(words)

            if repetition > 0.30:

                result["robustnessScore"] -= 0.20

                result["anomalies"].append(
                    "Highly repetitive text."
                )

        # -----------------------------
        # Printable Ratio
        # -----------------------------

        printable = sum(
            c.isprintable()
            for c in text
        )

        ratio = printable / len(text)

        if ratio < 0.95:

            result["robustnessScore"] -= 0.20

            result["anomalies"].append(
                "Contains unusual characters."
            )

        # -----------------------------
        # Entropy Estimate
        # -----------------------------

        entropy = 0

        for c in set(text):

            p = text.count(c) / len(text)

            entropy -= p * math.log2(p)

        result["entropy"] = round(entropy, 3)

        if entropy < 2.5:

            result["robustnessScore"] -= 0.10

            result["anomalies"].append(
                "Low information entropy."
            )

        # -----------------------------
        # Risk Level
        # -----------------------------

        result["robustnessScore"] = round(
            max(
                0.0,
                min(
                    1.0,
                    result["robustnessScore"]
                )
            ),
            3
        )

        score = result["robustnessScore"]

        if score >= 0.80:
            result["riskLevel"] = "LOW"

        elif score >= 0.50:
            result["riskLevel"] = "MEDIUM"

        else:
            result["riskLevel"] = "HIGH"

        return result