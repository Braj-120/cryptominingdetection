'use strict';
const migration = require('./models/migration');

function init() {
    migration();
    return Promise.resolve();
}

module.exports = init;