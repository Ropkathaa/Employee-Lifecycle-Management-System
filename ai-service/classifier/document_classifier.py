import re
from collections import defaultdict


class DocumentClassifier:
    """
    Rule-based document classifier.
    Designed so that an ML model can later replace
    the classify() method without changing the API.
    """

    def __init__(self):

        self.patterns = {

            "AADHAAR": {
                "weight": 3,
                "patterns": [
                    r"aadhaar",
                    r"unique identification authority",
                    r"government of india",
                    r"\b\d{4}\s?\d{4}\s?\d{4}\b"
                ]
            },

            "PAN": {
                "weight": 3,
                "patterns": [
                    r"income tax department",
                    r"permanent account number",
                    r"\b[A-Z]{5}[0-9]{4}[A-Z]\b"
                ]
            },

            "PASSPORT": {
                "weight": 3,
                "patterns": [
                    r"passport",
                    r"republic of india",
                    r"\b[A-Z][0-9]{7}\b"
                ]
            },

            "DRIVING_LICENSE": {
                "weight": 2,
                "patterns": [
                    r"driving licence",
                    r"driving license",
                    r"transport",
                    r"motor vehicle"
                ]
            },

            "VOTER_ID": {
                "weight": 2,
                "patterns": [
                    r"election commission",
                    r"elector",
                    r"epic"
                ]
            },

            "RESUME": {
                "weight": 1,
                "patterns": [
                    r"education",
                    r"experience",
                    r"skills",
                    r"projects",
                    r"internship",
                    r"curriculum vitae",
                    r"resume"
                ]
            }

        }

    def preprocess(self, text):

        text = text.lower()

        text = re.sub(r"\s+", " ", text)

        return text.strip()

    def classify(self, text):

        if not text:

            return {
                "status": "error",
                "predictedClass": "UNKNOWN",
                "confidence": 0.0,
                "scores": {}
            }

        text = self.preprocess(text)

        scores = defaultdict(float)

        for document, config in self.patterns.items():

            weight = config["weight"]

            for pattern in config["patterns"]:

                matches = re.findall(
                    pattern,
                    text,
                    flags=re.IGNORECASE
                )

                scores[document] += len(matches) * weight

        if len(scores) == 0:

            return {
                "status": "success",
                "predictedClass": "UNKNOWN",
                "confidence": 0.0,
                "scores": {}
            }

        predicted = max(
            scores,
            key=scores.get
        )

        maximum = max(scores.values())

        total = sum(scores.values())

        confidence = 0.0

        if total > 0:
            confidence = maximum / total

        if maximum == 0:

            predicted = "UNKNOWN"

            confidence = 0.0

        return {

            "status": "success",

            "predictedClass": predicted,

            "confidence": round(confidence, 3),

            "scores": dict(scores)

        }