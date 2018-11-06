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

            if (check.checkNull([lecture_id, price, idx])) {
                res.status(400).json({
                    message: "Null Value"
                });
            } else {
                let select_query = `select degree_pk, idx from lecture_idx where lecture_id = ? order by idx desc limit 1`;
                let select_result = await db.queryParamArr(select_query, [lecture_id]);
                if (!select_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
                }
                else {
                    if ((idx !== 0 && select_result[0].length === 0) || select_result[0].idx !== idx) {
                        res.status(200).json({
                            message: "can't apply"
                        });
                    }
                    else {
                        let idx_fk = select_result[0].degree_pk || 0;
                        let insert_query = `insert into lecture_apply (user_fk, lecture_fk, price, degree_fk) values (?, ?, ?, ?)`;
                        let insert_result = await db.queryParamArr(insert_query, [decoded.user_idx, lecture_id, price, idx_fk]);
                        if (!insert_result) {
                            res.status(500).json({
                                message: "Internal Server Error"
                            });
                        }
                        else {
                            res.status(200).json({
                                message: "success to apply lecture"
                            })
                        }
                    }

                }
            }
        }
    }
});

module.exports = router;
