require('dotenv').config();

const { CustomError } = require('../../utils/error/CustomError');
const { logger } = require('../../utils/logger');

module.exports.customErrorHandler = (err, req, res, next) => {
    req.logger.error({err});

    if (err instanceof CustomError) {
        return res.status(err.httpStatus).json({ error: err.message, status: err.status });
    } else {
        return res.status(500).json({ error: 'Internal Server Error', status: 500});
    }
}

module.exports.asyncErrorHandler = (fn) => (...args) => {
    const next = args[args.length - 1];
    Promise.resolve(fn(...args)).catch(next);
}
