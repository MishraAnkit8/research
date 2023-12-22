const crypto = require('crypto');

module.exports.generateUniqueId = () => {
    return crypto.randomUUID();
}

module.exports.generateSignedToken = (payload, secretKey) => {
    const signature = crypto
        .createHmac('sha256', secretKey)
        .update(payload)
        .digest('base64');

    const opaqueToken = `${payload}.${signature}`;
    return opaqueToken;
}

module.exports.verifySignedToken = (token, secretKey) => {
    if (!token || !token.includes('.') || !secretKey) {
        return false;
    }

    const [payload, signature] = token.split('.');
    const computedSignature = crypto
        .createHmac('sha256', secretKey)
        .update(payload)
        .digest('base64');

    if (computedSignature === signature) {
        return payload;
    }

    return false;
}