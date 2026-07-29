class DocumentKnowledge:
    """
    Knowledge base for supported document types.
    Used by the Rule Engine and future AI modules.
    """

    def __init__(self):

        self.documents = {

            "AADHAAR": {
                "keywords": [
                    "government of india",
                    "aadhaar",
                    "unique identification authority"
                ],
                "expected_fields": [
                    "name",
                    "date of birth",
                    "gender",
                    "aadhaar number"
                ],
                "description": "Indian Aadhaar Identity Card"
            },

            "PAN": {
                "keywords": [
                    "income tax department",
                    "permanent account number"
                ],
                "expected_fields": [
                    "name",
                    "father",
                    "pan number"
                ],
                "description": "Permanent Account Number Card"
            },

            "PASSPORT": {
                "keywords": [
                    "passport",
                    "republic of india"
                ],
                "expected_fields": [
                    "passport number",
                    "name",
                    "nationality",
                    "date of birth",
                    "expiry date"
                ],
                "description": "Indian Passport"
            },

            "DRIVING_LICENSE": {
                "keywords": [
                    "driving licence",
                    "driving license"
                ],
                "expected_fields": [
                    "license number",
                    "name",
                    "valid till"
                ],
                "description": "Driving Licence"
            },

            "VOTER_ID": {
                "keywords": [
                    "election commission",
                    "elector"
                ],
                "expected_fields": [
                    "epic number",
                    "name"
                ],
                "description": "Voter Identity Card"
            },

            "RESUME": {
                "keywords": [
                    "education",
                    "experience",
                    "skills"
                ],
                "expected_fields": [
                    "name",
                    "email",
                    "phone"
                ],
                "description": "Resume / CV"
            }

        }

    def get(self, document_type):

        return self.documents.get(
            document_type.upper(),
            None
        )

    def supported_documents(self):

        return list(
            self.documents.keys()
        )

    def is_supported(self, document_type):

        return (
            document_type.upper()
            in self.documents
        )

    def expected_fields(self, document_type):

        doc = self.get(document_type)

        if doc is None:
            return []

        return doc["expected_fields"]

    def keywords(self, document_type):

        doc = self.get(document_type)

        if doc is None:
            return []

        return doc["keywords"]

    def description(self, document_type):

        doc = self.get(document_type)

        if doc is None:
            return "Unknown Document"

        return doc["description"]