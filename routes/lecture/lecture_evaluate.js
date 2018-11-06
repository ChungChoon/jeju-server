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
            let {lecture_id, content} = req.body;
            if (check.checkNull([lecture_id, content])) {
                res.status(400).json({
                    message: "Null Value"
                });
            } else {
                let transaction_result = db.transactionControll(async (connection) => {
                    let update_query = `UPDATE lecture_apply SET state = 1 WHERE user_fk = ? and lecture_fk = ?`;
                    let insert_query = `INSERT INTO lecture_review (lecture_fk, user_fk, content) values (?, ?, ?)`;
                    await connection.query(update_query, [decoded.user_idx, lecture_id]);
                    await connection.query(insert_query, [lecture_id, decoded.user_idx, content]);
                    res.status(200).json({
                        message: "success to evaluate lecture"
                    })
                }).catch(error => {
                    return next(error)
                });
                // let transaction_result = await db.transactionControll(2, [update_query, [decoded.user_idx, lecture_id], insert_query, [decoded.user_idx, lecture_id, title, content]]);
                // if (!transaction_result) {
                //     res.status(500).json({
                //         message: "Internal server Error!"
                //     });
                // } else {
                //     console.log(transaction_result);
                //res.status(200).json({
                //                         message: "success to vote lecture"
                //                     })
                // }
            }

        }
    }
});

module.exports = router;
