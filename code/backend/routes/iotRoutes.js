const express = require("express");
const { latestData } = require("../mqttClient");

const router = express.Router();

router.get("/latest", (req, res) => {
  res.json({ success: true, data: latestData });
});

module.exports = router;
