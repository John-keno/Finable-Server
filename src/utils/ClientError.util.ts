/**
 * Custom error class for handling client-side errors with HTTP status codes.
 * Extends the built-in Error class.
 * @class ClientError
 * @extends {Error}
 * @property {number} statusCode - The HTTP status code associated with the error
 * @param {string} message - The error message to be displayed
 * @param {number} statusCode - The HTTP status code to be set
 */
class ClientError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
		Error.captureStackTrace(this, this.constructor);
	}
}

export default ClientError;
