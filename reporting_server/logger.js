const winston = require('winston');
const util = require('util');
const config = require('./data/config');

const logger = winston.createLogger({
  level: config.log_level,
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: 'api-server' },
  levels: winston.config.syslog.levels,
  transports: [
    new winston.transports.File({ filename: config.error_log, level: 'error' }),
    new winston.transports.File({ filename: config.normal_log }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(winston.format.simple(), winston.format.timestamp())
  }));
}
function _formatArgs(args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

global.console.log = function(...args) {
    logger.notice.apply(logger, _formatArgs(args))
}
global.console.error = function(...args) {
    logger.error.apply(logger, _formatArgs(args));
}
global.console.debug = function(...args) {
    logger.debug.apply(logger, _formatArgs(args));
}
global.console.warn = function(...args) {
    logger.warn.apply(logger, _formatArgs(args));
}