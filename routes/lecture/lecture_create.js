"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    crypto = require('crypto-promise'),
    jwt = require('../../module/jwt'),
    secret_key = require('../../config/secret_key');

/** @description 강의 생성 ( 강사 계정 ) - 클라이언트(웹)에서 블록에 강의 등록 트랜잭션 후 블록넘버를 기본키로 받아 강의 생성
 * @method POST
 */
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
                    lecture_bn,
                    title,
                    target,
                    kind,
                    period,
                    start_date,
                    end_date,
                    place,
                    curri_title,
                    curri_content,
                    intro,
                    limit_num,
                    price,
                    curri_count
                } = req.body;

                if (check.checkNull([
                        lecture_bn,
                        title,
                        target,
                        kind,
                        period,
                        start_date,
                        end_date,
                        place,
                        curri_title,
                        curri_content,
                        intro,
                        limit_num,
                        price,
                        curri_count
                    ])) {
                    res.status(400).json({
                        message: "Null Value"
                    });
                } else {
                    let transaction_result = db.transactionControll(async (connection) => {
                        let insert_lecture = `
                        insert into lecture 
                        (lecture_pk, title, target, kind, period, start_date, end_date, place, intro, limit_num, price, curri_count, owner_fk)
                        values( ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ?);`;
                        let insert_result = await connection.query(insert_lecture, [
                            lecture_bn,
                            title,
                            target,
                            kind,
                            period,
                            start_date,
                            end_date,
                            place,
                            intro,
                            limit_num,
                            price,
                            curri_count,
                            decoded.user_idx
                        ]);
                        let lecture_key = insert_result.insertId;
                        console.log(lecture_key);

                        let insert_tile = `insert into curri_title (title, lecture_fk, title_cnt) values (?, ?, ?);`;
                        let insert_content = `insert into curri_content (content, lecture_fk, content_cnt) values (?, ?,?);`;

                        for (let i = 0; i < curri_count; i++) {
                            await connection.query(insert_tile, [curri_title[i], lecture_bn, i]);
                            await connection.query(insert_content, [curri_content[i], lecture_bn, i]);
                        }
                        res.status(200).json({
                            message: "success to create lecture",
                            lecture_id: lecture_bn
                        });
                    }).catch(error => {
                        console.log(error);

                        res.status(500).json({
                            message: "Internal Server Error"
                        })
                    });
                }
            }
        }
    }
})

module.exports = router;