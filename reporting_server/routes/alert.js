'use strict';
const express = require('express');
const router = express.Router();
const alertsHandler = require('../handlers/alertsHandler')
const middleware = require('../middleware')

router.get('/ui/alerts', middleware.validateToken, alertsHandler.getAlerts);
router.post('/api/alerts', middleware.validateToken, alertsHandler.saveAlert);

module.exports = router;