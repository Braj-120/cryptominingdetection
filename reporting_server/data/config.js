'use strict';
module.exports = {
    "server": {
        "port": 3000
    },
    "token": {
        "expiry": "1d",
        "iss": "Reporting Server"
    },
    "database": {
        "path": __dirname + '/sql.db'
    },
    "log_level": "info",
    "error_log": __dirname + '/error.log',
    "normal_log": __dirname + "/out.log"
}