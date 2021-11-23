'use strict';
const db = require('./sqlite');
const bcrypt = require('bcrypt');

/**
 * Verifies User name and Password combination to the one stored in server
 * @param {String} username 
 * @param {String} password 
 * @returns {Promise<boolean>} - True or False
 */
module.exports.getUser = async function (username, password) {

    try {
        const rows = db.prepare("SELECT * FROM users WHERE name=?").all(username);
        if(!rows || rows.length === 0) {
            return false;
        }
        if (rows.length > 1) {
            throw new Error('Multiple Users detected');
        }
        return await bcrypt.compare(password, rows[0].password);
    } catch (err) {
        console.error(err);
        throw err;
    }
}
