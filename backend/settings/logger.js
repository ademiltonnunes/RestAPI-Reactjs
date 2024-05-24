import winston, {format, transports} from "winston"
import { DateTime } from "luxon";

const logFormat = format.printf(({level, message}) => {
    
    const dateFormat = DateTime.now().toUTC()
    return `{time: ${dateFormat}, level: ${level}, message: ${message}}`;
});

export const getLoggerInstance = (logLevel) => {
    const logger = winston.createLogger({
        level: 'info', // info, warn, error, debug
        format: format.json(),
        transports: [
            new transports.Console({format: format.combine( format.colorize(), logFormat)})
        ],
    });

    return logger;
}; 