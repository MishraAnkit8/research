require('dotenv').config();

const { DatabaseError } = require('pg');
const { CustomError } = require('../../utils/error/CustomError');

module.exports.customErrorHandler = (err, req, res, next) => {
    //req.logger.error({ err });
    console.log("======================= Error Start ==============================");
    console.log("req.reqId >>>>>>>>>>>>> ", req.reqId);
    console.log("err.moduleName >>>>>>>> ", err.moduleName);
    console.log("err.message >>>>>>>>>>> ", err.message);
    console.log("err.httpStatus >>>>>>>> ", err.httpStatus);
    console.log("err stack >>>>>>>>>>>>> ", err.stack);
    console.log("err.data >>>>>>>>>>>>>> ", err.data);
    console.log("======================= Error End ==============================");

    const contentType = req.headers['content-type'];
    const acceptType = req.headers.accept;

    if (contentType?.includes('application/json') || acceptType?.includes('application/json')) {
        if (err instanceof CustomError) {
            return res.status(err.httpStatus)
                .json({
                    reqId: req.reqId,
                    status: err.status,
                    message: err.message,
                    httpstatus: err.httpStatus,
                    data: err.data,
                });
        } else if (err instanceof DatabaseError) {
            return res.status(501).json({
                reqId: req.reqId,
                status: err.status,
                message: 'Internal Server Error',
                httpstatus: err.httpStatus,
                data: err.data,
            });
        } else {
            return res.status(500).json({
                reqId: req.reqId,
                status: err.status,
                message: 'Internal Server Error',
                httpstatus: err.httpStatus,
                data: err.data,
            });
        }
    } else {
        if (err.httpStatus == 401 || err.httpStatus == 403) {
            return res.redirect('/signin');
        } else {
            return res.status(err.httpStatus).json({
                reqId: req.reqId,
                status: err.status,
                message: err.message,
                httpstatus: err.httpStatus,
                data: err.data,
            });
        }
    }


}

module.exports.asyncErrorHandler = (fn) => (...args) => {
    const next = args[args.length - 1];
    Promise.resolve(fn(...args)).catch(next);
}