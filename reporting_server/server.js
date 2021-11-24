'use strict';
require('./logger');
const express = require('express');
const app = express();
const router = require('./routes');
const startup = require('./startup');
const config = require('./data/config');
const path = require('path');
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public', 'static'), {
    index: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
}))
router(app);
startup().then(() => {
    app.listen(config.server.port, () => {
        console.log('Started on port ' + config.server.port);
    });
}).catch((rej) => {
    console.error(rej)
})
