'use strict';
const authentication = require('./authentication.js');
const processAlert = require('./alert');
module.exports = (app) => {
    app.use(authentication);
    app.use(processAlert);
}