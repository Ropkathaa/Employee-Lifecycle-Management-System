"""
AI Model Loader Package

Future models:

- Document Classifier
- NER
- Forgery Detection
- Face Verification
- Signature Verification
- Embedding Models
"""

from pathlib import Path
import joblib


MODEL_DIR = Path(__file__).resolve().parent


class ModelLoader:

    _cache = {}

    @classmethod
    def load(cls, filename):

        path = MODEL_DIR / filename

        if filename in cls._cache:
            return cls._cache[filename]

        if not path.exists():
            return None

        model = joblib.load(path)

        cls._cache[filename] = model

        return model

    @classmethod
    def unload(cls, filename):

        if filename in cls._cache:
            del cls._cache[filename]

    @classmethod
    def clear(cls):

        cls._cache.clear()

    @classmethod
    def loaded_models(cls):

        return list(cls._cache.keys())