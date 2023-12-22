const moment = require('moment');

function CustomError(errData) {
    this.name = 'CustomError';
    this.moduleName = errData.moduleName,
    this.message = errData.message;
    this.status = errData.status;
    this.httpStatus = errData.httpStatus;
    this.date = new Date();
}

CustomError.prototype = Object.create(Error.prototype);
CustomError.prototype.constructor = CustomError;


module.exports.CustomError = CustomError;