'use strict';
require('./logger');
const express = require('express');
const app = express();
const router = require('./routes');
const startup = require('./startup');
const config = require('./data/config');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
router(app);
startup().then(() => {
    app.listen(config.server.port, () => {
        console.log('Started on port ' + config.server.port);
    });
}).catch((rej) => {
    console.error(rej)
})
