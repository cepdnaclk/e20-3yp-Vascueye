const axios = require('axios');

// Lambda URL — replace with your actual deployed Lambda Function URL
const LAMBDA_URL = 'https://anpzwncd3fh4niv2etowaxb3nu0nsvlt.lambda-url.eu-north-1.on.aws/';

exports.sendAbnormality = async (req, res) => {
    const { abnormality } = req.body;

    // Validate input
    if (!abnormality || (abnormality !== 'yes' && abnormality !== 'no')) {
        return res.status(400).json({ message: "Invalid input. Use 'yes' or 'no'." });
    }

    try {
        // Send to Lambda
        const lambdaResponse = await axios.post(
            LAMBDA_URL,
            { abnormality },
            { headers: { 'Content-Type': 'application/json' } }
        );

        return res.status(200).json({
            message: "Abnormality sent to Lambda.",
            lambdaResponse: lambdaResponse.data
        });
    } catch (error) {
        console.error("Error calling Lambda:", error.message);
        return res.status(500).json({
            message: "Lambda call failed",
            error: error.message
        });
    }
};
