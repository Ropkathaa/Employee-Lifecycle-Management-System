"""
=========================================================
Integrity Checker
Document Intelligence Engine (DIE) v2

Purpose
-------
Performs structural and file integrity validation before
any OCR or AI classification.

Author : ELMS AI Team
Version : 2.0
=========================================================
"""

from pathlib import Path
import mimetypes
import pdfplumber


class IntegrityChecker:

    def __init__(self):

        self.allowed_extensions = {
            ".pdf",
            ".png",
            ".jpg",
            ".jpeg"
        }

        self.max_file_size_mb = 20

    def validate(self, document_path):

        report = {

            "passed": True,

            "integrity_score": 100,

            "checks": {},

            "warnings": [],

            "errors": []

        }

        path = Path(document_path)

        # -----------------------------------------
        # 1. File Exists
        # -----------------------------------------

        exists = path.exists()

        report["checks"]["file_exists"] = exists

        if not exists:

            report["passed"] = False

            report["errors"].append("File not found.")

            report["integrity_score"] = 0

            return report

        # -----------------------------------------
        # 2. File Size
        # -----------------------------------------

        file_size_mb = path.stat().st_size / (1024 * 1024)

        report["checks"]["file_size_mb"] = round(file_size_mb, 2)

        if file_size_mb == 0:

            report["passed"] = False

            report["errors"].append("Empty file.")

            report["integrity_score"] -= 50

        elif file_size_mb > self.max_file_size_mb:

            report["warnings"].append(

                f"Large file ({file_size_mb:.2f} MB)."

            )

            report["integrity_score"] -= 5

        # -----------------------------------------
        # 3. Extension
        # -----------------------------------------

        extension = path.suffix.lower()

        report["checks"]["extension"] = extension

        if extension not in self.allowed_extensions:

            report["passed"] = False

            report["errors"].append(

                "Unsupported file extension."

            )

            report["integrity_score"] -= 25

        # -----------------------------------------
        # 4. MIME Type
        # -----------------------------------------

        mime_type = mimetypes.guess_type(path)[0]

        report["checks"]["mime_type"] = mime_type

        if mime_type is None:

            report["warnings"].append(

                "Unable to determine MIME type."

            )

            report["integrity_score"] -= 3

        # -----------------------------------------
        # 5. PDF Validation
        # -----------------------------------------

        if extension == ".pdf":

            try:

                with pdfplumber.open(document_path) as pdf:

                    page_count = len(pdf.pages)

                    report["checks"]["page_count"] = page_count

                    if page_count == 0:

                        report["passed"] = False

                        report["errors"].append(

                            "PDF contains zero pages."

                        )

                        report["integrity_score"] -= 40

                    total_characters = 0

                    blank_pages = 0

                    for page in pdf.pages:

                        text = page.extract_text()

                        if text:

                            total_characters += len(text)

                        else:

                            blank_pages += 1

                    report["checks"]["blank_pages"] = blank_pages

                    report["checks"]["text_characters"] = total_characters

                    if blank_pages == page_count:

                        report["warnings"].append(

                            "PDF appears image-based or blank."

                        )

                        report["integrity_score"] -= 8

            except Exception as e:

                report["passed"] = False

                report["errors"].append(

                    f"Corrupted PDF: {str(e)}"

                )

                report["integrity_score"] -= 40

        # -----------------------------------------
        # 6. Final Score
        # -----------------------------------------

        report["integrity_score"] = max(
            0,
            report["integrity_score"]
        )

        return report