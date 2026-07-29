from flask import Blueprint, request, jsonify

from validator.validator_v2 import DocumentValidatorV2

multi_document_bp = Blueprint(
    "multi_document_bp",
    __name__
)

validator = DocumentValidatorV2()


@multi_document_bp.route(
    "/validate-documents",
    methods=["POST"]
)
def validate_documents():

    try:

        if "documents" not in request.files:

            return jsonify({
                "status": "error",
                "message": "No documents uploaded."
            }), 400

        files = request.files.getlist("documents")

        document_types = request.form.getlist(
            "documentType"
        )

        results = []

        for index, file in enumerate(files):

            if index < len(document_types):
                document_type = document_types[index]
            else:
                document_type = "Unknown"

            result = validator.validate(
                file,
                document_type
            )

            results.append(result)

        valid_documents = sum(
            1 for r in results
            if r["validationStatus"] == "VALID"
        )

        invalid_documents = len(results) - valid_documents

        return jsonify({
            "status": "success",
            "totalDocuments": len(results),
            "validDocuments": valid_documents,
            "invalidDocuments": invalid_documents,
            "results": results
        }), 200

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500