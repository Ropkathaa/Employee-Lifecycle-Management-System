# ==========================================================
# Employee Lifecycle Management System
# Pipeline Engine: DocumentValidatorV2
# File Location: ai-service/validator_v2.py
# ==========================================================

from integrity.integrity_checker import IntegrityChecker
from ocr.ocr_engine import OCREngine
from classifier.document_classifier import DocumentClassifier
from rules.rule_engine import RuleEngine
from robustness.anomaly_detector import AnomalyDetector
from xai.explanation_engine import ExplanationEngine

# AI Automation Modules Integration
from automation.onboarding import generate_onboarding
from automation.it_checklist import generate_it_checklist
from automation.orientation import generate_orientation


class DocumentValidatorV2:
    """
    Complete 6-Stage AI Document Validation and Automation Pipeline.
    """

    def __init__(self):
        self.integrity = IntegrityChecker()
        self.ocr = OCREngine()
        self.classifier = DocumentClassifier()
        self.rules = RuleEngine()
        self.robustness = AnomalyDetector()
        self.xai = ExplanationEngine()

    def validate(self, file, document_type, candidate_data=None):
        """
        Executes full validation pipeline on uploaded document and generates
        downstream AI lifecycle workflows (Onboarding, IT Provisioning, Orientation).
        """

        # -----------------------------------
        # Stage 1: Integrity Check
        # -----------------------------------
        integrity = self.integrity.check(file)

        # Early exit if structural or signature integrity check completely fails
        if integrity.get("validationStatus") == "INVALID":
            return {
                "status": "success",
                "validationStatus": "INVALID",
                "confidence": 0.0,
                "integrity": integrity,
                "redirect_route": "/hr/dashboard/decision"
            }

        # -----------------------------------
        # Stage 2: OCR Text Extraction
        # -----------------------------------
        ocr = self.ocr.extract_text(file)
        text = str(ocr.get("text", "")).strip()

        # -----------------------------------
        # Stage 3: Classification
        # -----------------------------------
        classification = self.classifier.classify(text)
        predicted_class = classification.get("predictedClass", "UNKNOWN")

        # -----------------------------------
        # Stage 4: Business Rules
        # -----------------------------------
        rules = self.rules.validate(
            document_type,
            predicted_class,
            text
        )

        # -----------------------------------
        # Stage 5: Robustness & Anomaly Detection
        # -----------------------------------
        robustness = self.robustness.analyze(text)

        # -----------------------------------
        # Stage 6: Explainability (XAI)
        # -----------------------------------
        explanation = self.xai.explain(
            integrity,
            classification,
            rules,
            robustness
        )

        # -----------------------------------
        # Final Confidence Aggregation
        # -----------------------------------
        integrity_conf = float(integrity.get("confidence", 0))
        class_conf = float(classification.get("confidence", 0))
        rules_score = float(rules.get("score", 0))
        robustness_score = float(robustness.get("robustnessScore", 0))

        confidence = round(
            (integrity_conf + class_conf + rules_score + robustness_score) / 4.0,
            3
        )

        # Final decision resolution
        validation_status = explanation.get("decision", "INVALID")
        integrity_passed = (integrity.get("validationStatus") == "VALID")
        ocr_success = bool(text)

        # -----------------------------------
        # AI Automation Lifecycle Workflows
        # -----------------------------------
        onboarding = generate_onboarding(
            predicted_class=predicted_class,
            confidence=confidence,
            expected_type=document_type,
            integrity=integrity_passed,
            ocr_success=ocr_success,
            candidate_data=candidate_data
        )

        it_checklist = generate_it_checklist(
            predicted_class=predicted_class,
            confidence=confidence,
            expected_type=document_type,
            integrity=integrity_passed,
            ocr_success=ocr_success,
            candidate_data=candidate_data
        )

        orientation = generate_orientation(
            predicted_class=predicted_class,
            confidence=confidence,
            expected_type=document_type,
            integrity=integrity_passed,
            ocr_success=ocr_success,
            candidate_data=candidate_data
        )

        # -----------------------------------
        # Final Response Construction with Navigation Directive
        # -----------------------------------
        return {
            "status": "success",
            "redirect_route": "/hr/dashboard/decision",
            "documentName": getattr(file, "filename", "uploaded_document"),
            "documentType": document_type,
            "validationStatus": validation_status,
            "confidence": confidence,
            "integrity": integrity,
            "ocr": ocr,
            "classification": classification,
            "rules": rules,
            "robustness": robustness,
            "explanation": explanation,
            "automation": {
                "onboarding": onboarding,
                "itChecklist": it_checklist,
                "orientation": orientation
            }
        }


# Helper function to trigger validation from external routes
def run_validation(file, document_type="GENERAL", candidate_data=None):
    validator = DocumentValidatorV2()
    return validator.validate(file, document_type, candidate_data)