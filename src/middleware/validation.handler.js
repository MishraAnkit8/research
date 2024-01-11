const { validationResult } = require('express-validator');
const { invalidRequestError } = require('../../utils/error/error.handler');

// common validation error handler
module.exports.validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    console.log('errors ==>>', errors);
    if (!errors.isEmpty()) {
        const uniqueErrors = errors.errors.filter((item, index, arr) => {
            const isUnique = arr.findIndex((t) =>
                t.type === item.type &&
                t.msg === item.msg &&
                t.path === item.path &&
                t.location === item.location
            ) === index;
            return isUnique;
        });
        invalidRequestError({ type: 'ValidationError', moduleName: 'Validation Handler', message: 'Data validation failed.', data: uniqueErrors });
    }
    next();
};