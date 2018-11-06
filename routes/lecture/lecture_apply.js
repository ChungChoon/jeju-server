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
                price,
                idx
            } = req.body;
            console.log(lecture_id);

            if (check.checkNull([lecture_id, price, idx])) {
                res.status(400).json({
                    message: "Null Value"
                });
            } else {
                let insert_result1;
                let idx_fk = 0;
                if (idx !== 0) {
                    let insert_query1 = `insert into lecture_idx (lecture_id, idx) values (?, ?)`;
                    insert_result1 = await db.queryParamArr(insert_query1, [lecture_id, idx]);
                    if (!insert_result1) {
                        res.status(500).json({
                            message: "Internal server Error!"
                        });
                    }
                    else {
                        idx_fk = insert_result1.insertId;
                            let insert_query = `insert into lecture_apply (user_fk, lecture_fk, price, degree_fk) values (?, ?, ?, ?)`;
                            let insert_result = await db.queryParamArr(insert_query, [decoded.user_idx, lecture_id, price, idx_fk]);
                            if (!insert_result) {
                                res.status(500).json({
                                    message: "Internal server Error!"
                                });
                            }
                            else {
                                res.status(200).json({
                                    message: "success to apply lecture"
                                })
                            }
                    }
                }
                else {
                    let insert_query = `insert into lecture_apply (user_fk, lecture_fk, price, degree_fk) values (?, ?, ?, ?)`;
                    let insert_result = await db.queryParamArr(insert_query, [decoded.user_idx, lecture_id, price, idx_fk]);
                    if (!insert_result) {
                        res.status(500).json({
                            message: "Internal server Error!"
                        });
                    } else {
                        res.status(200).json({
                            message: "success to apply lecture"
                        })
                    }
                }
            }
        }
    }
});

module.exports = router;
