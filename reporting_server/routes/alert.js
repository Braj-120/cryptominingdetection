'use strict';
const express = require('express');
const router = express.Router();
const alertsHandler = require('../handlers/alertsHandler')
const middleware = require('../middleware')

router.get('/api/alerts', middleware.validateToken, alertsHandler.getAlerts);
router.post('/api/alerts', middleware.validateToken, alertsHandler.saveAlert);
router.get('/ui/alerts', middleware.validateTokenUI, alertsHandler.getAlerts);
router.get('/ui/getalertsperday', middleware.validateTokenUI, alertsHandler.getAlertsPerDay);
router.get('/ui/matchedvsnot', middleware.validateTokenUI, alertsHandler.matchedNonMatched);
module.exports = router;