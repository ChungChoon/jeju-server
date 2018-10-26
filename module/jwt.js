const jwt = require('jsonwebtoken');

const secret_key = require('../config/secret_key').secret;

module.exports = {
    //make token
    sign: function (mail, user_idx) {
        const options = {
            algorithm: "HS256",
            expiresIn: 60 * 60 * 24 * 30 // 30 days
        };
        const payload = {
            "mail": mail,
            "user_idx": user_idx
        };

        let token = jwt.sign(payload, secret_key, options);
        return token;
    },

    // token valid check
    verify: function (token) {
        let decoded;
        try {
            decoded = jwt.verify(token, secret_key);
            if (!decoded) {
                return -1;
            } else {
                return decoded;
            }
        } catch (err) {
            if (err.message === 'jwt expired') console.log('expired token');
            else if (err.message === 'invalid token') console.log('invalid token');
        }
    }
}