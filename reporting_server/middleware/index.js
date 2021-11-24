'use strict';
const tokens = require('../models/token');
/**
 * Validate the incoming request to ensure it contains valid token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports.validateToken = (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        const host = req.headers['hostname'];
        if (bearerHeader && host) {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            const valid = tokens.validateToken(bearerToken, host);
            if (valid) {
                return next();
            }
        }
        // Forbidden
        return res.status(403).end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

/**
 * Validate the incoming UI and UI API request to ensure it contains valid token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 module.exports.validateTokenUI = (req, res, next) => {
    try {
        if (!req.cookies) {
            return res.status(401).redirect("?" + "unauthorized=true");
        }
        const bearerHeader = req.cookies['authorization'];
        const host = req.hostname;
        if (bearerHeader && host) {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            const valid = tokens.validateToken(bearerToken, host);
            if (valid) {
                return next();
            }
        }
        // Forbidden
        return res.status(401).redirect("?" + "unauthorized=true");
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
