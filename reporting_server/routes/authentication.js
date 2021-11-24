'use strict';
const express = require('express');
const router = express.Router();
const auth = require('../handlers/auth.js');

router.post('/api/authenticate', auth.authenticate);
router.post('/ui/authentication', auth.authenticateUI)

module.exports = router;