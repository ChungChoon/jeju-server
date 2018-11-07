"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    jwt = require('../../module/jwt');

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
            let {
                lecture_id,
                price
            } = req.body;

            if (check.checkNull([lecture_id, price])) {
                res.status(400).json({
                    message: "Null Value"
                });
            } else {
                let insert_query = `insert into lecture_apply (user_fk, lecture_fk, )`
            }
        }
    }
});

module.exports = router;
