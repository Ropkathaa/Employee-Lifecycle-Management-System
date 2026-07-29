from integrity.integrity_checker import IntegrityChecker
from ocr.ocr_engine import OCREngine
from classifier.document_classifier import DocumentClassifier
from rules.rule_engine import RuleEngine
from robustness.anomaly_detector import AnomalyDetector
from xai.explanation_engine import ExplanationEngine


class DocumentValidatorV2:
    """
    Complete AI Document Validation Pipeline
    """

    def __init__(self):

        self.integrity = IntegrityChecker()

        self.ocr = OCREngine()

        self.classifier = DocumentClassifier()

        self.rules = RuleEngine()

        self.robustness = AnomalyDetector()

        self.xai = ExplanationEngine()

    def validate(self, file, document_type):

        # -----------------------------------
        # Stage 1
        # Integrity Check
        # -----------------------------------

        integrity = self.integrity.check(file)

        if integrity["validationStatus"] == "INVALID":

            return integrity

        # -----------------------------------
        # Stage 2
        # OCR
        # -----------------------------------

        ocr = self.ocr.extract_text(file)

        text = ocr.get("text", "")

        # -----------------------------------
        # Stage 3
        # Classification
        # -----------------------------------

        classification = self.classifier.classify(text)

        # -----------------------------------
        # Stage 4
        # Business Rules
        # -----------------------------------

        rules = self.rules.validate(
            document_type,
            classification["predictedClass"],
            text
        )

        # -----------------------------------
        # Stage 5
        # Robustness
        # -----------------------------------

        robustness = self.robustness.analyze(text)

        # -----------------------------------
        # Stage 6
        # Explainability
        # -----------------------------------

        explanation = self.xai.explain(
            integrity,
            classification,
            rules,
            robustness
        )

        # -----------------------------------
        # Final Confidence
        # -----------------------------------

        confidence = (
            integrity["confidence"]
            + classification["confidence"]
            + rules["score"]
            + robustness["robustnessScore"]
        ) / 4

        confidence = round(confidence, 3)

        # -----------------------------------
        # Final Decision
        # -----------------------------------

        validation_status = explanation["decision"]

        return {

            "status": "success",

            "documentName": file.filename,

            "documentType": document_type,

            "validationStatus": validation_status,

            "confidence": confidence,

            "integrity": integrity,

            "ocr": ocr,

            "classification": classification,

            "rules": rules,

            "robustness": robustness,

            "explanation": explanation
        }