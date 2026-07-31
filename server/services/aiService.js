const axios = require("axios");

const AI_SERVICE_URL = "http://127.0.0.1:5001";

/**
 * Sends uploaded documents to the Flask AI Service
 * for multi-document validation.
 *
 * @param {FormData} formData
 * @param {Object} headers
 * @returns {Promise<Object>}
 */
async function validateDocument(formData, headers) {
    try {
        const response = await axios.post(
            `${AI_SERVICE_URL}/validate-documents`,
            formData,
            {
                headers,
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                timeout: 60000
            }
        );

        return response.data;

    } catch (error) {

        console.error("\n========== AI SERVICE ERROR ==========");
        console.error(error.message);

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response:", error.response.data);

            throw {
                status: error.response.status,
                message:
                    error.response.data?.message ||
                    error.response.statusText ||
                    "AI Service Error",
                data: error.response.data
            };
        }

        if (error.request) {
            console.error("No response received from AI service.");
        }

        console.error("======================================\n");

        throw {
            status: 500,
            message: "Unable to connect to AI Service."
        };
    }
}

module.exports = {
    validateDocument
};