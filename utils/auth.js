const argon2 = require('argon2');
const {CustomError} = require('./CustomError');

module.exports.hashPassword = (password) => {
    return argon2.hash(password);
}

module.exports.verifyPassword = async (hashedPassword, inputPassword) => {
    
    if(!hashedPassword || !inputPassword) {
        throw new CustomError({
            moduleName: 'Auth Service',
            message: 'User authentication failed!',
            httpStatus: 401
        });
    }
    
    return argon2.verify(hashedPassword, inputPassword);
}