'use strict';

const alertsModel = require('../models/alerts');

/**
 * Save alert handler
 * @param {*} req 
 * @param {*} res 
 */
function saveAlert(req, res) {
    try {
        const data = req.body;
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).send('Invalid body');
        }
        alertsModel.saveAlert(data);
        res.status(200).send('Success');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

/**
 * Get alert handler. 
 * @param {*} req 
 * @param {*} res 
 * @returns Returns all alert with a total count
 */
function getAlerts(req, res) {
    try {
        const query = req.query;
        if (query.filter && typeof Array.isArray(JSON.parse(query.filter))) {
            return res.status(400).end();
        }
        if (query.sort && (typeof JSON.parse(query.sort) !== "object" || Array.isArray(JSON.parse(query.sort)))) {
            return res.status(400).end();
        }
        const output = alertsModel.getAlerts(query);
        res.status(200).json(output);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

/**
 * Get the alerts per day handler
 * @param {*} req 
 * @param {*} res 
 */
function getAlertsPerDay(req, res) {
    try {
        const output = alertsModel.getAlertsPerDay();
        res.status(200).json(output);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

function matchedNonMatched (req, res) {
    try {
        const output = alertsModel.matchedNonMatched()
        res.status(200).json(output)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports.matchedNonMatched = matchedNonMatched;
module.exports.getAlertsPerDay = getAlertsPerDay;
module.exports.getAlerts = getAlerts;
module.exports.saveAlert = saveAlert;