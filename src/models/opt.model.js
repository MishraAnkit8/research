const { autoriders_read_db, autoriders_write_db } = require('../../config/db-configs');
const dbPoolManager = require('../../config/db-pool-manager');
const moment = require('moment');

const autoDbR = dbPoolManager.get('autoDbR', autoriders_read_db);
const autoDbW = dbPoolManager.get('autoDbW', autoriders_write_db);

module.exports.insertOTP = (otp, otpType, userLid, otpForLid) => {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    let sql = {
        text: `INSERT INTO otp(otp, otp_type_lid, otp_for_lid, user_lid, expiry_date, initiated_at, created_by) 
        SELECT $1, ot.id, $2, $3, NOW() + ot.validity_in_mins * INTERVAL '1 MINUTE', $4, $5
        FROM otp_type ot
        WHERE ot.name = $6;`,
        values: [otp, otpForLid, userLid, currentDate, userLid, otpType],
    };
    
    return autoDbW.query(sql);
}

module.exports.getOTP = (otpType, userLid) => {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    let sql = {
        text: `SELECT * FROM otp WHERE user_lid = $1 AND otp_type_lid = $2 AND expiry_date > $3;`,
        values: [deviceToken, userLid, currentDate],
    };
    
    return autoDbR.query(sql);
}