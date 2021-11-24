'use strict';
const authentication = require('./authentication.js');
const processAlert = require('./alert');
const path = require('path');
const middleware = require('../middleware')
const options = {
    root: path.join(__dirname, '..','public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };
module.exports = (app) => {
    app.use(authentication);
    app.use(processAlert);
    app.get('/', (req, res) => {
        res.sendFile('index.html', options)
    });
    app.get('/dashboard', middleware.validateTokenUI, (req, res) => {
        res.sendFile('dashboard.html', options)
    });
}