const savedTokens = new Set();

exports.savePushToken = (req, res) => {
  const { token,doctorId } = req.body;
  if (!token || !doctorId) {
    return res.status(400).json({ 
      message: "Both token and doctorId are required" 
    });
  }

  if (!savedTokens.has(token)) {
    savedTokens.add(token);
    console.log("✅ Push token saved:", token);
    console.log("✅ Doctor ID recieved:", doctorId);
  }

  res.status(200).json({ message: "Push token saved" });
};

exports.getSavedTokens = () => Array.from(savedTokens);
