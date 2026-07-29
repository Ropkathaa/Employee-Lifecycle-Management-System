import os

import pytesseract
import fitz
from PIL import Image

from config.settings import Settings


# Configure Tesseract if path is provided
if Settings.TESSERACT_PATH and os.path.exists(Settings.TESSERACT_PATH):
    pytesseract.pytesseract.tesseract_cmd = Settings.TESSERACT_PATH


class OCREngine:

    def __init__(self):
        pass

    def extract_text(self, file):

        filename = file.filename.lower()

        if filename.endswith((".png", ".jpg", ".jpeg")):
            return self._image(file)

        if filename.endswith(".pdf"):
            return self._pdf(file)

        return {
            "status": "error",
            "text": "",
            "confidence": 0.0,
            "pages": 0,
            "message": "Unsupported file type."
        }

    def _image(self, file):

        try:

            image = Image.open(file.stream)

            text = pytesseract.image_to_string(
                image,
                lang=Settings.OCR_LANGUAGE
            )

            file.stream.seek(0)

            confidence = 1.0 if text.strip() else 0.4

            return {
                "status": "success",
                "text": text,
                "confidence": confidence,
                "pages": 1
            }

        except Exception as e:

            file.stream.seek(0)

            return {
                "status": "error",
                "text": "",
                "confidence": 0.0,
                "pages": 0,
                "message": str(e)
            }

    def _pdf(self, file):

        try:

            pdf = fitz.open(
                stream=file.read(),
                filetype="pdf"
            )

            text = ""

            for page in pdf:
                text += page.get_text()

            pages = pdf.page_count

            pdf.close()

            file.stream.seek(0)

            return {
                "status": "success",
                "text": text,
                "confidence": 1.0 if text.strip() else 0.5,
                "pages": pages
            }

        except Exception as e:

            file.stream.seek(0)

            return {
                "status": "error",
                "text": "",
                "confidence": 0.0,
                "pages": 0,
                "message": str(e)
            }