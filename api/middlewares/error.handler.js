import cLog from '../utils/cLog.js';

function logError(err, req, res, next) {
	cLog.red(err);
	next(err);
}

function errorHandler(err, req, res, next) {
	return res.status(500).json({
		msg: err.message,
		stack: err.stack,
	});
}

function boomErrorHandler(err, req, res, next) {
	if (err.isBoom) {
		const { output } = err;
		return res.status(output.statusCode).json(output.payload);
	}
	next(err);
}

export { logError, errorHandler, boomErrorHandler };
