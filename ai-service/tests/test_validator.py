import io

from app import app


client = app.test_client()


def test_health():

    response = client.get("/health")

    assert response.status_code == 200


def test_home():

    response = client.get("/")

    assert response.status_code == 200


def test_image_validation():

    fake_image = (
        io.BytesIO(
            b"\x89PNG\r\n\x1a\n"
        ),
        "sample.png"
    )

    response = client.post(

        "/validate-document",

        data={

            "document": fake_image,

            "documentType": "AADHAAR"

        },

        content_type="multipart/form-data"

    )

    assert response.status_code in [200, 400]


def test_pdf_validation():

    fake_pdf = (

        io.BytesIO(

            b"%PDF-1.4\n"

        ),

        "sample.pdf"

    )

    response = client.post(

        "/validate-document",

        data={

            "document": fake_pdf,

            "documentType": "PAN"

        },

        content_type="multipart/form-data"

    )

    assert response.status_code in [200, 400]