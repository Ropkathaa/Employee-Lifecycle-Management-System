import os
import mimetypes
from PIL import Image

try:
    import fitz
except ImportError:
    fitz = None


class IntegrityChecker:

    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}

    def check(self, file):

        filename = file.filename or ""

        result = {
            "status": "success",
            "validationStatus": "VALID",
            "confidence": 1.0,
            "documentName": filename,
            "checks": {},
            "errors": [],
            "warnings": []
        }

        if file is None:
            result["status"] = "error"
            result["validationStatus"] = "INVALID"
            result["confidence"] = 0
            result["errors"].append("No file received.")
            return result

        if filename == "":
            result["status"] = "error"
            result["validationStatus"] = "INVALID"
            result["confidence"] = 0
            result["errors"].append("Empty filename.")
            return result

        if "." not in filename:
            result["status"] = "error"
            result["validationStatus"] = "INVALID"
            result["confidence"] = 0
            result["errors"].append("Invalid filename.")
            return result

        extension = filename.rsplit(".", 1)[1].lower()

        result["checks"]["extension"] = extension

        if extension not in self.ALLOWED_EXTENSIONS:
            result["status"] = "error"
            result["validationStatus"] = "INVALID"
            result["confidence"] = 0
            result["errors"].append("Unsupported extension.")
            return result

        result["checks"]["mimeType"] = mimetypes.guess_type(filename)[0]

        file.stream.seek(0, os.SEEK_END)
        size = file.stream.tell()
        file.stream.seek(0)

        result["checks"]["sizeBytes"] = size

        if size == 0:
            result["status"] = "error"
            result["validationStatus"] = "INVALID"
            result["confidence"] = 0
            result["errors"].append("Empty file.")
            return result

        if extension in ["png", "jpg", "jpeg"]:

            try:

                image = Image.open(file.stream)

                width, height = image.size

                image.verify()

                file.stream.seek(0)

                result["checks"]["width"] = width
                result["checks"]["height"] = height
                result["checks"]["readable"] = True

            except Exception as e:

                file.stream.seek(0)

                result["status"] = "error"
                result["validationStatus"] = "INVALID"
                result["confidence"] = 0
                result["errors"].append(str(e))

                return result

        if extension == "pdf":

            try:

                header = file.stream.read(4)
                file.stream.seek(0)

                if header != b"%PDF":

                    result["status"] = "error"
                    result["validationStatus"] = "INVALID"
                    result["confidence"] = 0
                    result["errors"].append("Invalid PDF.")

                    return result

                if fitz is not None:

                    pdf = fitz.open(
                        stream=file.read(),
                        filetype="pdf"
                    )

                    result["checks"]["pageCount"] = pdf.page_count

                    pdf.close()

                    file.stream.seek(0)

            except Exception as e:

                file.stream.seek(0)

                result["status"] = "error"
                result["validationStatus"] = "INVALID"
                result["confidence"] = 0
                result["errors"].append(str(e))

                return result

        result["checks"]["supportedFormat"] = True
        result["checks"]["filePresent"] = True

        return result
