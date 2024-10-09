import winston, { format } from 'winston';

const { combine, colorize, timestamp, prettyPrint, errors, printf } = format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        errors({ stack: true }),
        timestamp(),
        prettyPrint(),
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                errors({ stack: true }),
                colorize(),
                printf(({ level, message, timestamp, stack, tag: _tag }) => {
                    const tag = _tag ? `[${_tag}] `: '';
                    if (stack) {
                        return `${timestamp} ${level}: ${tag}${message}\n${stack}`;
                    }
                    return `${timestamp} ${level}: ${tag}${message}`;
                }),
            ),
        }),
    ]
});

const createLogger = (tag: string) => {
    return {
        debug: (message: string, ...meta: any[]) => {
            logger.debug({
                message,
                meta,
                tag,
            });
        },
        info: (message: string, ...meta: any[]) => {
            logger.info({
                message,
                meta,
                tag,
            });
        },
        warn: (message: string, ...meta: any[]) => {
            logger.warn({
                message,
                meta,
                tag,
            });
        },
        error: (message: string, ...meta: any[]) => {
            logger.error({
                message,
                meta,
                tag,
            });
        },
    }
}

export {
    createLogger
};