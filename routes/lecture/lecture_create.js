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
        res.status(400).send({
            message: "Null Value"
        })
    } else {
        let decoded = jwt.verify(token);

        if (decoded === 10) {
            res.status(500).send({
                message: "token err", //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
                expired: 1
            });

            return;
        }
        //토큰에 에러 있을 때
        if (decoded === -1) {
            res.status(500).send({
                message: "token err" //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
            });
        } else {
            let check_query = `select * from user where mail = ?;`;
            let check_result = await db.queryParamArr(check_query, [decoded.mail]);
            console.log(decoded);

            if (!check_result) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else if (check_result[0].user_gb !== 1) {
                res.status(200).send({
                    message: "Auth Error"
                });
            } else {
                let {
                    title,
                    target,
                    kind,
                    period,
                    start_date,
                    end_date,
                    place,
                    curriculum,
                    intro
                } = req.body;

                if (check.checkNull([title,
                        target,
                        kind,
                        period,
                        start_date,
                        end_date,
                        place,
                        curriculum,
                        intro
                    ])) {
                    res.status(400).json({
                        message: "Null Value"
                    })
                } else {
                    let insert_lecture = `insert into lecture (title,
                    target,
                    kind,
                    period,
                    start_date,
                    end_date,
                    place,
                    curriculum,
                    intro) values (?, ?, ?, ? ,?, ?, ?, ?, ?);`;
                    let insert_lecture_result = await db.queryParamArr(insert_lecture, [title,
                        target,
                        kind,
                        period,
                        start_date,
                        end_date,
                        place,
                        curriculum,
                        intro
                    ]);

                    if (!insert_lecture_result) { // 쿼리수행중 에러가 있을 경우
                        res.status(500).send({
                            message: "Internal Server Error"
                        });
                    } else {
                        let lecture_idx = insert_lecture_result.insertId;
                        let lecture_insert2 = `insert into lecture_owner (user_fk, lecture_fk) values (?, ?)`;
                        let insert_lecture_result2 = await db.queryParamArr(lecture_insert2, [decoded.user_idx, lecture_idx]);
                        if (!insert_lecture_result2) { // 쿼리수행중 에러가 있을 경우
                            res.status(500).send({
                                message: "Internal Server Error"
                            });
                        } else {
                            res.status(200).send({
                                message: "Success To Sign Up"
                            })
                        }
                    }
                }
            }

        }
    }
});


module.exports = router;