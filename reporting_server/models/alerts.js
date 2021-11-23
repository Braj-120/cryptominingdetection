'use strict';
const db = require('./sqlite');
const ulid = require('ulid').ulid;

/**
 * Processes and stores the alert into the table
 * @param {*} alert 
 */
function saveAlert(alert) {
    let stmt;
    alert.generated_at = (new Date()).toISOString();
    alert.id = ulid();
    console.log(alert)
    let values = [];
    if (alert.matched) {
        stmt = db.prepare(`INSERT INTO alerts (id, title, hostname, host_ip, dest_address, fqdn, pool_name, crypto_url, port_number, crypto_name, abbreviation, protocol, datetime, generated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`);
        for (const val of "id, title, hostname, host_ip, address, fqdn, pool_name, url, port_number, crypto_name, abbreviation, protocol, datetime, generated_at".split(',')) {
            values.push(alert[val.trim()]);
        }
    } else {
        stmt = db.prepare('INSERT INTO alerts (title, hostname, host_ip, datetime, generated_at, id) VALUES(?,?,?,?,?,?);')
        for (const val of "title, hostname, host_ip, datetime, generated_at, id".split(",")) {
            values.push(alert[val.trim()]);
        }
    }
    console.log(values)
    const op = stmt.run(values);
    if (op.changes) {
        console.log(`Alert inserted successfully ${alert.id}`)
    }
}

/**
 * Fetches all alerts stored in db. Use options to apply sort and filter
 * @param {Object} options - contains {sort: {`column on which to apply sort`: `asc/desc`}, filter: [{`filter_col`: `filter_value`}]}
 */
function getAlerts(options) {
    let query = 'SELECT * FROM alerts';
    const filter_vals = [];
    if (options.filter && options.filter.length > 0) {
        query = query + " WHERE ";
        for (const [k, v] of options.filter) {
            query = query + k + "=?"
            filter_vals.push(v);
        }
    }
    if (options.sort && Object.keys(options.sort)[0]) {
        query = query + "ORDER BY " + Object.keys(options.sort)[0] + " " + Object.values(options.sort);
    }
    const rows = db.prepare(query).all(...filter_vals);
    return {
        total: rows.length,
        data: rows
    }
}

module.exports.getAlerts = getAlerts;
module.exports.saveAlert = saveAlert;