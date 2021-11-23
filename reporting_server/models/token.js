'use strict';
const db = require('./sqlite');
const jwt = require('jsonwebtoken');
const ulid = require('ulid').ulid;
const config = require('../data/config')
/**
 * Verifies User name and Password combination to the one stored in server
 * @param {String} username 
 * @param {String} host
 * @returns {Promise<string>} - A compressed JWT token
 */
module.exports.createToken = async function (username, host) {
    try {
        const rows = db.prepare("SELECT * FROM users WHERE name=?").all(username);
        const name = rows[0].name;
        const secret = ulid();
        const id = ulid();
        const token = jwt.sign({
            name: name,
            host: host,
            iss: config.token.iss,
            keyid: id
        }, secret, {
            keyid: id,
            expiresIn: config.token.expiry
        });
        let op = {}
        db.transaction(() => {
            db.prepare("DELETE FROM tokens WHERE host=?").run(host);
            op = db.prepare("INSERT INTO tokens VALUES(?,?,?,?,?, DATE('now'))").run(id, username, host, secret, token);
        }).call(this)
        if (!op.changes) {
            throw new Error('Failed to insert token into database');
        }
        return token;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

/**
 * Validate the incoming token with the one stored in DB for corresponding host
 * @param {string} token 
 * @param {string} host 
 * @returns {Promise<boolean>} True or False
 */
module.exports.validateToken = function (token, host) {
    try {
        const row = db.prepare("SELECT * FROM tokens WHERE host=?").get(host);
        if (!row) {
            return false;
        }
        let tokenOut;
        try {
            tokenOut = jwt.verify(token, row.secret);
        } catch(err) {
            console.debug('JWT Verify failed', err)
            return false;
        }
        
        if (host === tokenOut.host && row.token === token) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error);
        throw error;
    }
}