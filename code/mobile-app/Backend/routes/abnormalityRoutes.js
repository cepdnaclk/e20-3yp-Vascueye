const express = require('express');
const router = express.Router();
const abnormalityController = require('../controller/abnormalityController');

// POST /api/abnormality
router.post('/', abnormalityController.sendAbnormality);

module.exports = router;
