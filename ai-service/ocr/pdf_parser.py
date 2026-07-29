import fitz


class PDFParser:
    """
    Extracts text and metadata from PDF documents.
    """

    def __init__(self):
        pass

    def parse(self, file):

        try:

            pdf = fitz.open(
                stream=file.read(),
                filetype="pdf"
            )

            text = ""
            page_details = []

            for page_number, page in enumerate(pdf, start=1):

                page_text = page.get_text()

                page_details.append({
                    "page": page_number,
                    "characters": len(page_text),
                    "words": len(page_text.split())
                })

                text += page_text + "\n"

            metadata = pdf.metadata

            result = {
                "status": "success",
                "pages": pdf.page_count,
                "text": text.strip(),
                "metadata": {
                    "title": metadata.get("title", ""),
                    "author": metadata.get("author", ""),
                    "creator": metadata.get("creator", ""),
                    "producer": metadata.get("producer", ""),
                    "subject": metadata.get("subject", "")
                },
                "pageDetails": page_details
            }

            pdf.close()

            file.stream.seek(0)

            return result

        except Exception as e:

            file.stream.seek(0)

            return {
                "status": "error",
                "pages": 0,
                "text": "",
                "metadata": {},
                "pageDetails": [],
                "message": str(e)
            }