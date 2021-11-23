'use strict';
const db = require('./sqlite');
const fs = require('fs')
/**
 * Migration handler code
 */
module.exports = function migration() {
    try {
        const migration = fs.readFileSync(__dirname + '/migrate-schema.sql', 'utf8');
        db.exec(migration);
        console.log('Migration complete');
    } catch (error) {
        const mig_failed = fs.readFileSync(__dirname + '/migration-fail.sql', 'utf-8');
        db.exec(mig_failed);
        console.error(error);
        throw error;
    }
}