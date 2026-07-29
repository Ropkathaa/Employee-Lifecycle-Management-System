import hashlib
import mimetypes
import os
from pathlib import Path


class FileUtils:
    """
    Common file utility functions.
    """

    ALLOWED_EXTENSIONS = {
        ".png",
        ".jpg",
        ".jpeg",
        ".pdf"
    }

    @staticmethod
    def get_extension(filename):

        return Path(filename).suffix.lower()

    @staticmethod
    def is_supported(filename):

        extension = FileUtils.get_extension(filename)

        return extension in FileUtils.ALLOWED_EXTENSIONS

    @staticmethod
    def get_mime_type(filename):

        mime, _ = mimetypes.guess_type(filename)

        return mime

    @staticmethod
    def get_file_size(file):

        current_position = file.stream.tell()

        file.stream.seek(0, os.SEEK_END)

        size = file.stream.tell()

        file.stream.seek(current_position)

        return size

    @staticmethod
    def calculate_sha256(file):

        current_position = file.stream.tell()

        file.stream.seek(0)

        sha = hashlib.sha256()

        while True:

            chunk = file.stream.read(8192)

            if not chunk:
                break

            sha.update(chunk)

        digest = sha.hexdigest()

        file.stream.seek(current_position)

        return digest

    @staticmethod
    def basic_metadata(file):

        return {
            "filename": file.filename,
            "extension": FileUtils.get_extension(file.filename),
            "mimeType": FileUtils.get_mime_type(file.filename),
            "sizeBytes": FileUtils.get_file_size(file),
            "sha256": FileUtils.calculate_sha256(file)
        }

    @staticmethod
    def validate(file):

        metadata = FileUtils.basic_metadata(file)

        errors = []

        if not FileUtils.is_supported(file.filename):

            errors.append("Unsupported file format.")

        if metadata["sizeBytes"] == 0:

            errors.append("Empty file.")

        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "metadata": metadata
        }