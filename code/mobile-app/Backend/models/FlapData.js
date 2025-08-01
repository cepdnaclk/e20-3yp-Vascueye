const mongoose = require("mongoose");

const FlapDataSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  image_url: {
    type: String,
    required: true, // URL of image stored in S3
  },
  temperature: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: "flapdatas",
  timestamps: false, // Since you have your own timestamp field
});

const FlapData = mongoose.model("FlapData", FlapDataSchema);
module.exports = FlapData;
