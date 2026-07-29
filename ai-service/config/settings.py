import os
from pathlib import Path


class Settings:
    """
    Central configuration for the AI Document Validation Service.
    """

    # -----------------------------
    # Project
    # -----------------------------

    PROJECT_NAME = "Employee Lifecycle Management AI Service"

    VERSION = "2.0.0"

    DEBUG = True

    BASE_DIR = Path(__file__).resolve().parent.parent

    # -----------------------------
    # Upload Settings
    # -----------------------------

    MAX_FILE_SIZE_MB = 10

    MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

    ALLOWED_EXTENSIONS = {
        "png",
        "jpg",
        "jpeg",
        "pdf"
    }

    # -----------------------------
    # OCR
    # -----------------------------

    TESSERACT_PATH = os.getenv(
        "TESSERACT_PATH",
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )

    OCR_LANGUAGE = "eng"

    # -----------------------------
    # Confidence Thresholds
    # -----------------------------

    MIN_VALIDATION_CONFIDENCE = 0.70

    MIN_CLASSIFICATION_CONFIDENCE = 0.60

    MIN_ROBUSTNESS_SCORE = 0.50

    # -----------------------------
    # Security
    # -----------------------------

    ENABLE_SHA256 = True

    ENABLE_FILE_SIGNATURE_CHECK = True

    ENABLE_METADATA_CHECK = True

    # -----------------------------
    # Logging
    # -----------------------------

    LOG_LEVEL = "INFO"

    LOG_DIRECTORY = BASE_DIR / "logs"

    # -----------------------------
    # Future AI Models
    # -----------------------------

    MODEL_DIRECTORY = BASE_DIR / "models"

    CLASSIFIER_MODEL = MODEL_DIRECTORY / "document_classifier.pkl"

    EMBEDDING_MODEL = MODEL_DIRECTORY / "embedding_model.pkl"

    ANOMALY_MODEL = MODEL_DIRECTORY / "anomaly_detector.pkl"

    # -----------------------------
    # API
    # -----------------------------

    HOST = "0.0.0.0"

    PORT = 5001

    # -----------------------------
    # Helper
    # -----------------------------

    @classmethod
    def as_dict(cls):

        return {
            "project": cls.PROJECT_NAME,
            "version": cls.VERSION,
            "debug": cls.DEBUG,
            "maxFileSizeMB": cls.MAX_FILE_SIZE_MB,
            "allowedExtensions": list(cls.ALLOWED_EXTENSIONS),
            "ocrLanguage": cls.OCR_LANGUAGE,
            "minimumValidationConfidence": cls.MIN_VALIDATION_CONFIDENCE,
            "minimumClassificationConfidence": cls.MIN_CLASSIFICATION_CONFIDENCE,
            "minimumRobustnessScore": cls.MIN_ROBUSTNESS_SCORE,
            "logDirectory": str(cls.LOG_DIRECTORY),
            "modelDirectory": str(cls.MODEL_DIRECTORY),
            "host": cls.HOST,
            "port": cls.PORT
        }