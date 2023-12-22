module.exports.checkKeysAndValues = (obj, keysArray) => {
    return keysArray.every(key => obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== undefined && obj[key] !== '');
}

module.exports.generateOTP = () => {
    const otp = Math.floor(Math.random() * 9000) + 1000;
    return otp;
}