# ==========================================================
# Employee Lifecycle Management System - Application Entry
# File Location: ai-service/app.py
# ==========================================================

from flask import Flask, jsonify
from flask_cors import CORS

from routes.document_routes import document_bp
from routes.multi_document_routes import multi_document_bp
from config.settings import Settings


def create_app():
    """
    Application Factory Pattern for initialising the Flask app
    and registering blueprints and error handlers.
    """
    app = Flask(__name__)

    # Set maximum file upload payload limit
    app.config["MAX_CONTENT_LENGTH"] = Settings.MAX_FILE_SIZE_BYTES

    # Enable CORS for cross-origin frontend integrations
    CORS(
        app,
        resources={
            r"/*": {
                "origins": "*"
            }
        }
    )

    # Register API Blueprints
    app.register_blueprint(document_bp)
    app.register_blueprint(multi_document_bp)

    # ------------------------------------------------------
    # System Status & Health Endpoints
    # ------------------------------------------------------

    @app.route("/", methods=["GET"])
    def home():
        return jsonify({
            "service": Settings.PROJECT_NAME,
            "version": Settings.VERSION,
            "status": "running",
            "redirect_route": "/candidate/upload",
            "aiModules": {
                "xai": "Loaded",
                "onboarding": "Loaded",
                "itChecklist": "Loaded",
                "orientation": "Loaded"
            }
        }), 200

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "healthy",
            "version": Settings.VERSION,
            "redirect_route": "/candidate/upload",
            "supportedFormats": list(Settings.ALLOWED_EXTENSIONS),
            "maxUploadMB": Settings.MAX_FILE_SIZE_MB
        }), 200

    # ------------------------------------------------------
    # Global Error Handlers
    # ------------------------------------------------------

    @app.errorhandler(413)
    def file_too_large(e):
        return jsonify({
            "status": "error",
            "redirect_route": "/candidate/upload",
            "message": f"Maximum upload size is {Settings.MAX_FILE_SIZE_MB} MB."
        }), 413

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            "status": "error",
            "redirect_route": "/candidate/upload",
            "message": "Endpoint not found."
        }), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({
            "status": "error",
            "redirect_route": "/candidate/upload",
            "message": "Internal server error."
        }), 500

    return app


# Create the app instance
app = create_app()


if __name__ == "__main__":
    app.run(
        host=Settings.HOST,
        port=Settings.PORT,
        debug=Settings.DEBUG
    )