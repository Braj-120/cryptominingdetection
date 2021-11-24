'use strict';
const db = require('./sqlite');
const ulid = require('ulid').ulid;

const col_list = ["id",
    "title",
    "hostname",
    "host_ip",
    "dest_address",
    "fqdn",
    "pool_name",
    "crypto_url",
    "port_number",
    "crypto_name",
    "abbreviation",
    "protocol",
    "datetime",
    "generated_at"];
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
        options.filter = JSON.parse(options.filter);
        query = query + " WHERE ";
        for (const [k, v] of options.filter) {
            if (!col_list.includes(k)) {
                return;
            }
            query = query + k + "=?"
            filter_vals.push(v);
        }
    }
    if (options.sort) {
        options.sort = JSON.parse(options.sort);
        if (col_list.includes(Object.keys(options.sort)[0]) && ['asc', 'desc'].includes(Object.values(options.sort)[0])) {
            query = query + " ORDER BY " + Object.keys(options.sort)[0] + " " + Object.values(options.sort)[0] + ";";
        }
    }
    const rows = db.prepare(query).all(filter_vals);
    return {
        total: rows.length,
        data: rows
    }
}

/**
 * 
 * @returns JSON containing count and datetime
 */
function getAlertsPerDay() {
    const today = new Date()
    const query = 'SELECT count(*), date(datetime) FROM alerts WHERE datetime >' + new Date().setDate(today.getDate()-30) + " GROUP BY date(datetime) ORDER BY datetime asc;";
    const rows = db.prepare(query).all();
    return rows;
}

/**
 * Return the count of matched vs non matched entries
 */
function matchedNonMatched() {
    let query = 'SELECT count(*) as count FROM alerts WHERE dest_address IS NULL;'
    const not_matched = db.prepare(query).get();
    query = 'SELECT count(*) as count FROM alerts WHERE dest_address IS NOT NULL;'
    const matched = db.prepare(query).get();
    return {
        matched: matched.count,
        not_matched: not_matched.count
    }
}
module.exports.matchedNonMatched = matchedNonMatched;
module.exports.getAlertsPerDay = getAlertsPerDay;
module.exports.getAlerts = getAlerts;
module.exports.saveAlert = saveAlert;

