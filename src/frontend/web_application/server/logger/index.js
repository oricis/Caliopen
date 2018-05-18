const winston = require('winston');

const LOGGER_CATEGORY = 'caliopen-frontend';

let logger;

const getLogger = () => {
  if (!logger) {
    logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.label({ label: LOGGER_CATEGORY }),
        winston.format.align(),
        winston.format.printf(info => `${info.timestamp} ${info.level} ${info.label} - ${info.message}`),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          format: winston.format.uncolorize(),
          filename: 'combined.log',
        }),
      ],
    });
  }

  return logger;
};

module.exports = getLogger;
