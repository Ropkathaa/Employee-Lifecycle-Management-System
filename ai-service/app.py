from flask import Flask, jsonify
from flask_cors import CORS

from routes.document_routes import document_bp
from routes.multi_document_routes import multi_document_bp
from config.settings import Settings


def create_app():

    app = Flask(__name__)

    app.config["MAX_CONTENT_LENGTH"] = Settings.MAX_FILE_SIZE_BYTES

    CORS(
        app,
        resources={
            r"/*": {
                "origins": "*"
            }
        }
    )

    app.register_blueprint(document_bp)

    app.register_blueprint(multi_document_bp)

    @app.route("/", methods=["GET"])
    def home():

        return jsonify({

            "service": Settings.PROJECT_NAME,

            "version": Settings.VERSION,

            "status": "running"

        })

    @app.route("/health", methods=["GET"])
    def health():

        return jsonify({

            "status": "healthy",

            "version": Settings.VERSION,

            "supportedFormats": list(
                Settings.ALLOWED_EXTENSIONS
            ),

            "maxUploadMB": Settings.MAX_FILE_SIZE_MB

        })

    @app.errorhandler(413)
    def file_too_large(e):

        return jsonify({

            "status": "error",

            "message": f"Maximum upload size is {Settings.MAX_FILE_SIZE_MB} MB."

        }), 413

    @app.errorhandler(404)
    def not_found(e):

        return jsonify({

            "status": "error",

            "message": "Endpoint not found."

        }), 404

    @app.errorhandler(500)
    def internal_error(e):

        return jsonify({

            "status": "error",

            "message": "Internal server error."

        }), 500

    return app


app = create_app()


if __name__ == "__main__":

    app.run(

        host=Settings.HOST,

        port=Settings.PORT,

        debug=Settings.DEBUG

    )