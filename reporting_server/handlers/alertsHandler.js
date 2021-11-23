'use strict';

const alertsModel = require('../models/alerts');

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

function getAlerts(req, res) {
    try {
        const query = req.query;
        if (query.filter && typeof query.filter !== Array) {
            return res.status(400).end();
        }
        if (query.sort && typeof query.sort !== Object) {
            return res.status(400).end();
        }
        const output = alertsModel.getAlerts(query);
        res.status(200).json(output);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
module.exports.getAlerts = getAlerts;
module.exports.saveAlert = saveAlert;