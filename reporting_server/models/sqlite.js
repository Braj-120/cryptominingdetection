'use strict';
const Database = require('better-sqlite3');
const config = require('../data/config')
const db = new Database(config.database.path, { verbose: console.debug });

module.exports = db;