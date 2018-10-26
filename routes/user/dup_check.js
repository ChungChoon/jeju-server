"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check');


router.post('/mail', async (req, res, next) => {
    let mail = req.body.mail;

    if (check.checkNull([mail])) {
        res.status(400).json({
            message: 'Null Value'
        });
    } else {
        let check_query = `select * from user where mail = ?`;

        let check_result = await db.queryParamArr(check_query, [mail]);
        if (!check_result) {
            res.status(500).json({
                message: "Internal Server Error"
            });
        } else if (check_result.length >= 1) {
            res.status(200).json({
                message: "duplication"
            });
        } else {
            res.status(200).json({
                message: "avaliable"
            });
        }
    }

});

router.post('/wallet', async (req, res, next) => {

});

module.exports = router;