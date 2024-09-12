const express = require('express');
const getHealth = require('../controllers');
const router = express.Router();

router.get('/ht', getHealth);

module.exports = router;