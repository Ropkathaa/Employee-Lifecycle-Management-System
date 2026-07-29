"""
=========================================================
Document Intelligence Engine (DIE) Version 2
Master Validation Pipeline

Author : ELMS AI Team
Version: 2.0

Responsibilities
----------------
1. File Integrity Validation
2. OCR & Text Extraction
3. Intelligent Document Classification
4. Rule-based Verification
5. Confidence Fusion
6. Explainable AI
7. Risk Assessment

=========================================================
"""

from integrity.integrity_checker import IntegrityChecker
from ocr.ocr_engine import OCREngine
from classifier.document_classifier import DocumentClassifier
from rules.validation_rules import ValidationRules
from xai.confidence_fusion import ConfidenceFusion
from xai.explanation_engine import ExplanationEngine
from robustness.anomaly_detector import AnomalyDetector


class DocumentValidatorV2:

    def __init__(self):

        self.integrity = IntegrityChecker()

        self.ocr = OCREngine()

        self.classifier = DocumentClassifier()

        self.rules = ValidationRules()

        self.confidence = ConfidenceFusion()

        self.xai = ExplanationEngine()

        self.anomaly = AnomalyDetector()

    def validate(self,
                 document_path,
                 selected_document_type):

        """
        Complete Validation Pipeline
        """

        result = {}

        # -------------------------------------------------
        # Stage 1
        # -------------------------------------------------

        integrity_result = self.integrity.validate(
            document_path
        )

        result["integrity"] = integrity_result

        if not integrity_result["passed"]:

            return {

                "status": "INVALID",

                "stage": "Integrity",

                "reason": integrity_result,

            }

        # -------------------------------------------------
        # Stage 2
        # -------------------------------------------------

        ocr_result = self.ocr.extract_text(
            document_path
        )

        result["ocr"] = ocr_result

        # -------------------------------------------------
        # Stage 3
        # -------------------------------------------------

        classification = self.classifier.predict(

            ocr_result,

            document_path

        )

        result["classification"] = classification

        # -------------------------------------------------
        # Stage 4
        # -------------------------------------------------

        rule_result = self.rules.verify(

            selected_document_type,

            classification

        )

        result["rule_engine"] = rule_result

        # -------------------------------------------------
        # Stage 5
        # -------------------------------------------------

        anomaly_result = self.anomaly.analyze(

            document_path,

            ocr_result,

            classification

        )

        result["anomaly"] = anomaly_result

        # -------------------------------------------------
        # Stage 6
        # -------------------------------------------------

        confidence = self.confidence.calculate(

            integrity_result,

            ocr_result,

            classification,

            rule_result,

            anomaly_result

        )

        result["confidence"] = confidence

        # -------------------------------------------------
        # Stage 7
        # -------------------------------------------------

        explanation = self.xai.generate(

            integrity_result,

            ocr_result,

            classification,

            rule_result,

            anomaly_result,

            confidence

        )

        result["explanation"] = explanation

        # -------------------------------------------------

        result["status"] = (

            "VALID"

            if rule_result["passed"]

            else "INVALID"

        )

        return result