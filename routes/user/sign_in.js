"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    crypto = require('crypto-promise'),
    secret_key = require('../../config/secret_key'),
    jwt = require('../../../module/jwt');

//사용자 로그인
router.post('/', async (req, res, next) => {
    let {
        mail,
        passwd
    } = req.body;

    if (check.checkNull([mail, passwd])) {
        res.status(400).json({
            message: "Null Value"
        })
    } else {
        let check_query = `select * from user where mail = ?;`;
        let check_result = await db.queryParamArr(check_query, [mail]);

        if (!check_result) {
            res.status(500).json({
                message: "Internal Server Error"
            });
        } else if (check_result.length === 1) {
            const cipher = await crypto.cipher('aes256', secret_key.key)(passwd);
            if (cipher.toString('hex') === check_result[0].passwd) {

            }
        }
    }

});

module.exports = router;