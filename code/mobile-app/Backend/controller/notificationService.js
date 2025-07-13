const axios = require("axios");
const { getSavedTokens } = require("./pushTokenController");

// Your Lambda URL (replace with your actual Lambda endpoint)
const LAMBDA_URL = "https://anpzwncd3fh4niv2etowaxb3nu0nsvlt.lambda-url.eu-north-1.on.aws/";

async function sendAbnormalityNotification(abnormality) {
  const tokens = getSavedTokens();
  console.log("Saved push tokens:", tokens);

  if (!tokens.length) {
    console.log("No push tokens saved. Skipping notification.");
    return;
  }

  try {
    const response = await axios.post(
      LAMBDA_URL,
      { abnormality, tokens },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Lambda response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to send notification:", error.message);
    throw error;
  }
}

module.exports = { sendAbnormalityNotification };
