const awsIot = require("aws-iot-device-sdk");
const FlapData = require("./models/FlapData");
require("dotenv").config();

const device = awsIot.device({
  keyPath: process.env.AWS_IOT_PRIVATE_KEY,
  certPath: process.env.AWS_IOT_CERTIFICATE,
  caPath: process.env.AWS_IOT_CA,
  clientId: process.env.AWS_IOT_CLIENT_ID,
  host: process.env.AWS_IOT_ENDPOINT,
});

let latestData = {
  temperature: null,
  image: null,
}; // Store latest received data

device.on("connect", () => {
  console.log("Connected to AWS IoT Core");

  const topics = ["sensor/data", "sensor/image"];
  device.subscribe(topics, (err) => {
    if (err) {
      console.error("Subscription Error:", err);
    } else {
      console.log(`Subscribed to topics: ${topics.join(", ")}`);
    }
  });
});

device.on("message", async (topic, payload) => {
  try {
    const data = JSON.parse(payload.toString());
    const { patient_id, image_url, temperature } = data;

    if (topic === "sensor/data") {
      try {
        const flapData = new FlapData({ patient_id, image_url, temperature });
        await flapData.save();

        // Send success response back to Raspberry Pi
        device.publish(
          "sensor/response",
          JSON.stringify({
            status: "success",
            message: "Data stored successfully",
          })
        );
      } catch (dbError) {
        console.error("Database Error:", dbError);

        // Notify Raspberry Pi of failure
        device.publish(
          "sensor/response",
          JSON.stringify({
            status: "error",
            message: "Failed to store data",
          })
        );
      }
    }

    console.log(`Received data on ${topic}:`, data);
  } catch (error) {
    console.error("Error parsing MQTT message:", error);

    // Notify Raspberry Pi of parsing error
    device.publish(
      "sensor/response",
      JSON.stringify({
        status: "error",
        message: "Invalid JSON format",
      })
    );
  }
});

device.on("error", (error) => {
  console.error("AWS IoT Error:", error);
});

module.exports = { device, latestData };
