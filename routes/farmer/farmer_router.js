"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    jwt = require('../../module/jwt');

const lecture_info = require('./lecture_info');

router.use('/info', lecture_info);

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
                select a.user_pk, a.mail, a.name, date_format(a.birth, "%Y-%m-%d") as birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, a.farmer_career, a.farm_name, a.reg_num, a.farm_pk, a.farm_addr, a.subject, a.kind, a.farm_img, b.lecture_pk, b.title, b.target, b.kind, b.period, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.intro, b.limit_num, b.price, b.curri_count, b.apply
                from farmer_info a, lecture b
                where a.user_pk = ?
                `
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
