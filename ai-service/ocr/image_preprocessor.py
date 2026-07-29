import cv2
import numpy as np
from PIL import Image


class ImagePreprocessor:
    """
    Image preprocessing for OCR.
    """

    def __init__(self):
        pass

    def preprocess(self, file):

        try:

            image = Image.open(file.stream).convert("RGB")

            image = np.array(image)

            image = cv2.cvtColor(
                image,
                cv2.COLOR_RGB2BGR
            )

            gray = cv2.cvtColor(
                image,
                cv2.COLOR_BGR2GRAY
            )

            denoised = cv2.GaussianBlur(
                gray,
                (3, 3),
                0
            )

            binary = cv2.adaptiveThreshold(
                denoised,
                255,
                cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY,
                31,
                2
            )

            height, width = binary.shape

            if width < 1200:

                scale = 1200 / width

                binary = cv2.resize(
                    binary,
                    None,
                    fx=scale,
                    fy=scale,
                    interpolation=cv2.INTER_CUBIC
                )

            file.stream.seek(0)

            return {
                "status": "success",
                "image": binary
            }

        except Exception as e:

            file.stream.seek(0)

            return {
                "status": "error",
                "image": None,
                "message": str(e)
            }