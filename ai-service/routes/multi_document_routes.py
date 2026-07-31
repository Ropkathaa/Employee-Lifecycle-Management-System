# ==========================================================
# Employee Lifecycle Management System
# Multi-Document Validation Routes
# File Location: ai-service/routes/multi_validator.py
# ==========================================================

import traceback
from flask import Blueprint, request, jsonify

# Import the updated V2 Validator Engine
from validator.validator_v2 import DocumentValidatorV2

multi_document_bp = Blueprint("multi_document_bp", __name__)
validator = DocumentValidatorV2()


@multi_document_bp.route("/validate-documents", methods=["POST"])
def validate_documents():
    """
    POST /validate-documents
    Handles batch document uploads, runs each document through the 6-stage pipeline,
    and returns aggregated validation metrics alongside lifecycle automation workflows.
    """
    try:
        # 1. Validate Uploaded Files Presence
        if "documents" not in request.files:
            return jsonify({
                "status": "error",
                "message": "No documents uploaded."
            }), 400

        files = request.files.getlist("documents")

        if not files or len(files) == 0:
            return jsonify({
                "status": "error",
                "message": "The uploaded files list is empty."
            }), 400

        # 2. Extract Matching Document Types and Candidate Info
        document_types = request.form.getlist("documentType")

        candidate_data = {
            "name": request.form.get("candidateName", "N/A"),
            "email": request.form.get("candidateEmail", "N/A"),
            "department": request.form.get("department", "General"),
            "role": request.form.get("role", "Employee")
        }

        results = []

        # 3. Process Each Uploaded Document
        for index, file in enumerate(files):
            # Skip empty file handles
            if not file or getattr(file, "filename", "") == "":
                continue

            # Resolve expected document type corresponding to index
            if index < len(document_types):
                document_type = document_types[index].strip()
            else:
                document_type = "Unknown"

            # Execute Validation Pipeline
            result = validator.validate(
                file=file,
                document_type=document_type,
                candidate_data=candidate_data
            )

            results.append(result)

        if not results:
            return jsonify({
                "status": "error",
                "message": "No valid file streams were processed."
            }), 400

        # 4. Aggregated Statistics
        valid_documents = sum(
            1 for r in results
            if r.get("validationStatus") == "VALID"
        )
        invalid_documents = len(results) - valid_documents

        # 5. Build Aggregated Response with Frontend Redirection Directive
        return jsonify({
            "status": "success",
            "redirect_route": "/hr/dashboard/decision",
            "apiVersion": "2.0",
            "service": "Multi-Document Validation & Lifecycle Automation",
            "totalDocuments": len(results),
            "validDocuments": valid_documents,
            "invalidDocuments": invalid_documents,
            "results": results
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500