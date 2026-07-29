const axios = require("axios");

const AI_SERVICE_URL = "http://127.0.0.1:5001";

async function validateDocument(formData, headers) {

    try {

        const response = await axios.post(
            `${AI_SERVICE_URL}/validate-document`,
            formData,
            {
                headers,
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            }
        );

        return response.data;

    } catch (error) {

        if (error.response) {
            throw error.response.data;
        }

        throw {
            status: "error",
            message: "Unable to connect to AI Service."
        };
    }
}

module.exports = {
    validateDocument
};