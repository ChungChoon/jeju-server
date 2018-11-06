"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    jwt = require('../../module/jwt'),
    pool = require('../../config/db_pool');

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
            let {lecture_id, title, content} = req.body;
            if (check.checkNull([lecture_id, title, content])) {
                res.status(400).json({
                    message: "Null Value"
                });
            } else {
                let update_query;
                let update_result;
                update_query = `UPDATE lecture_apply SET state = 1 WHERE user_fk = ? and lecture_fk = ?`;
                // update_result = await db.queryParamArr(update_query, [decoded.user_idx, lecture_id]);
                let insert_query;
                insert_query = `INSERT INTO lecture_review (lecture_fk, user_fk, title, content) values (?, ?, ?, ?)`;
                const conn = await pool.getConnection();
                await conn.beginTransaction();
                await conn.query(update_query, [decoded.user_idx, lecture_id]);
                await conn.query(insert_query, [lecture_id, decoded.user_idx, title, content]);
                let transaction_result = await conn.commit();
                conn.release();
                // let transaction_result = await db.transactionControll(2, [update_query, [decoded.user_idx, lecture_id], insert_query, [decoded.user_idx, lecture_id, title, content]]);
                if (!transaction_result) {
                    res.status(500).json({
                        message: "Internal server Error!"
                    });
                } else {
                    res.status(200).json({
                        message: "success to vote lecture"
                    })
                }
            }

        }
    }
});

router.get('/', async (req, res, next) => {
    console.log('여기 잘 들어왔어요');
    await db.transactionControll("hello", [1,2,23]);
});

module.exports = router;
