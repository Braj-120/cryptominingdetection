'use strict';
const users = require('../models/users');
const tokens = require('../models/token');
const path = require('path');
/**
 * Authenticate the incoming request which contains username and password
 * @param {*} req 
 * @param {*} res 
 * @returns response which contains bearer token if everything is valid
 */
module.exports.authenticate = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const host = req.body.hostname;
        if (!username || !password || !host) {
            return res.status(400).end();
        }
        const valid = await users.getUser(username, password);
        if (!valid) {
            return res.status(401).send('Unauthorized');
        }
        const token = await tokens.createToken(username, host);
        return res.status(200).send(token);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}

/**
 * For Authentication from the UI route
 * @param {*} req 
 * @param {*} res 
 * @returns response
 */
module.exports.authenticateUI = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const host = req.hostname;
        if (!username || !password || !host) {
            return res.status(400).redirect("/");
        }
        const valid = await users.getUser(username, password);
        if (!valid) {
            const string = encodeURIComponent('unauthorized');
            return res.status(401).redirect("/?" + string + "=true");
        }
        const token = await tokens.createToken(username, host);
        return res.status(200).cookie('authorization', 'Bearer ' + token, {
            httpOnly: true
        }).redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}