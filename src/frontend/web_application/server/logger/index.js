const winston = require('winston');
const { Syslog } = require('winston-syslog');

const LOGGER_CATEGORY = 'caliopen-frontend';
const stdFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.label({ label: LOGGER_CATEGORY }),
  winston.format.align(),
  winston.format.printf((info) => {
    // console.log('info log', info);

    return `${info.timestamp} ${info.level} ${info.label} - ${info.message}`
  }),
);

let logger;

const getLogger = () => {
  if (!logger) {
    logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: stdFormat,
        }),
        // new winston.transports.File({
        //   format: winston.format.uncolorize(),
        //   filename: 'combined.log',
        // }),
        new Syslog({
          eol: '\n',
          facility: 'user',
          type: '5424',
        }),
      ],
      levels: winston.config.syslog.levels,
    });
  }

  return logger;
};

module.exports = getLogger;
