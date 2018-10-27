"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    crypto = require('crypto-promise'),
    jwt = require('../../module/jwt'),
    secret_key = require('../../config/secret_key');

router.post('/', async (req, res, next) => {
    let token = req.headers.token;

    if (!token) {
        res.status(400).json({
            message: "No token"
        });
    } else {
        let decoded = jwt.verify(token);

        if (decoded === 10) {
            res.status(500).json({
                message: "token err",
                expired: 1
            });
            return
        }
        if (decoded === -1) {
            res.status(500).json({
                message: "token err"
            });
        } else {
            let lecture_id = req.body.lecture_id;
            console.log(lecture_id);

            if (check.checkNull([lecture_id])) {
                res.status(400).json({
                    message: "Null Value"
                });
            } else {
                let check_auth = `select * from lecture_owner where lecture_fk = ? and user_fk = ?`;
                let select_result = await db.queryParamArr(check_auth, [lecture_id, decoded.user_idx]);

                if (!select_result) {
                    res.status(500).json({
                        message: "Internal server Error!"
                    });
                } else {
                    if (select_result[0].length === 0) {
                        res.status(200).json({
                            message: "no access"
                        });
                    } else {
                        res.status(200).json({
                            message: "success to check lecture"
                        })
                    }
                }
            }
        }
    }
})

module.exports = router;