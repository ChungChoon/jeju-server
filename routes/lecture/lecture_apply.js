"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    jwt = require('../../module/jwt');

/**
 * @description 강의 수강 ( 수강생 계정 )
 */
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
                let transaction_result = db.transactionControll(async (connection) => {
                    let update_query = `UPDATE lecture SET apply = apply + 1 WHERE lecture_pk = ?`;
                    let insert_query = `insert into lecture_apply (user_fk, lecture_fk, price) values (?, ?, ?)`;
                    await connection.query(update_query, [lecture_id]);
                    await connection.query(insert_query, [decoded.user_idx, lecture_id, price]);
                    res.status(200).json({
                        message: "success to evaluate lecture"
                    })
                }).catch(error => {
                    // return next(error)
                    console.log(error);
                    res.status(500).json({
                        message: "Internal Server Error"
                    })
                });

            }
        }
    }
});

module.exports = router;
