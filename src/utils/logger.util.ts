import { createLogger, format, transports } from "winston";

/**
 * Creates and configures a Winston logger instance for application logging.
 *
 * The logger is configured with:
 * - Info level logging
 * - Timestamp format: "YYYY-MM-DD hh:mm:ss.SSS A"
 * - Custom format: timestamp [LEVEL]: message
 *
 * @exports {Logger} - Configured Winston logger instance
 *
 * Transports:
 * - Console output with colorized messages
 * - File output to "logs/requests.log"
 */

export default createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
		format.printf(
			({ timestamp, level, message }) =>
				`${timestamp} [${level.toUpperCase()}]: ${message}`
		)
	),
	transports: [
		new transports.Console({
			format: format.combine(
				format.printf(
					({ timestamp, level, message }) =>
						`${timestamp} [${level.toUpperCase()}]: ${message}`
				),
				format.colorize({ all: true })
			),
		}),
		new transports.File({ filename: "logs/requests.log" }), // Log to a file
	],
});
