from flask import Blueprint, request, jsonify

from validator.validator_v2 import DocumentValidatorV2

document_bp = Blueprint("document_bp", __name__)

validator = DocumentValidatorV2()


@document_bp.route("/validate-document", methods=["POST"])
def validate_document():

    try:

        if "document" not in request.files:
            return jsonify({
                "status": "error",
                "message": "No document uploaded."
            }), 400

        file = request.files["document"]

        document_type = request.form.get(
            "documentType",
            "Unknown"
        )

        result = validator.validate(
            file,
            document_type
        )

        return jsonify(result), 200

    except Exception as e:
        import traceback

        traceback.print_exc()

        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500