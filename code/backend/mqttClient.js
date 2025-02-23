const awsIot = require("aws-iot-device-sdk");
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

  const topics = ["sensor/temperature", "sensor/image"];
  device.subscribe(topics, (err) => {
    if (err) {
      console.error("Subscription Error:", err);
    } else {
      console.log(`Subscribed to topics: ${topics.join(", ")}`);
    }
  });
});

device.on("message", (topic, payload) => {
  try {
    const data = JSON.parse(payload.toString());

    if (topic === "sensor/temperature") {
      latestData.temperature = data;
    } else if (topic === "sensor/image") {
      latestData.image = data;
    }

    console.log(`Received data on ${topic}:`, data);
  } catch (error) {
    console.error("Error parsing MQTT message:", error);
  }
});

device.on("error", (error) => {
  console.error("AWS IoT Error:", error);
});

module.exports = { device, latestData };
