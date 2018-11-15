"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    jwt = require('../../module/jwt');


/** @description 나의 강의 목록 (학생 계정)
 * @method GET
 */
router.get('/', async (req, res, next) => {

    let token = req.headers.token;

    if (!token) {
        res.status(400).send({
            message: "fail to show mypage from client, Null value"
        });
    } else {
        let decoded = jwt.verify(token);
        if (decoded === 10) {
            res.status(500).send({
                message: "token err", //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
                expired: 1
            });

            return;
        }
        if (decoded === -1) {
            res.status(500).send({
                message: "token error"
            });
        } else {
            let select_query = `
                select c.state, c.attend_cnt, a.user_pk, a.name, a.img, a.user_gb, a.farm_name, a.farm_img, b.lecture_pk, b.title, b.kind, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply
                from farmer_info a
                join lecture b
                on a.user_pk = b.owner_fk
                join lecture_apply c
                on c.lecture_fk = b.lecture_pk and c.user_fk = ?
                order by c.apply_idx desc
                `;
            let select_result = await db.queryParamArr(select_query, [decoded.user_idx]);
            if (!select_result) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else {
                res.status(200).json({
                    message: "Success To Get Farmer My Lecture",
                    data: select_result
                })
            }
        }
    }
});

module.exports = router;