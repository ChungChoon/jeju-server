"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    jwt = require('../../module/jwt');

const lecture_create = require('./lecture_create');
const lecture_apply = require('./lecture_apply');
const lecture_attend = require('./lecture_attend');
const lecture_evaluate = require('./lecture_evaluate');

router.use('/create', lecture_create);
router.use('/apply', lecture_apply);
router.use('/attend', lecture_attend);
router.use('/evaluate', lecture_evaluate);

router.get('/', async (req, res, next) => {
    let select_query = `
        select a.user_pk, a.mail, a.name, date_format(a.birth, "%Y-%m-%d") as birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, a.farmer_career, a.farm_name, a.reg_num, a.farm_pk, a.farm_addr, a.subject, a.kind, a.farm_img, b.title, b.target, b.kind, b.period, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply 
        from farmer_info a, lecture b, lecture_owner c 
        where a.user_pk = c.user_fk  and b.lecture_pk = c.lecture_fk
        `
    let select_result = await db.queryParamNone(select_query);

    if (!select_result) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    } else if (select_result.length === 0) {
        console.log(select_result[0]);
        res.status(200).json({
            message: "doesn's exist"
        })
    } else {
        res.status(200).json({
            message: "Success To Get Information",
            data: select_result
        })
    }
});

//강의 상세조회
router.get('/:id', async (req, res, next) => {
    let token = req.headers.token;
    let lecture_id = req.params.id;
    if (!lecture_id) {
        res.status(400).send({
            message: "Null Value"
        });
    } else {
        if (token) {
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
                let select_query = `
                    select c.attend_cnt, (select count( * ) as buy_count from lecture_apply as a_buy where a_buy.lecture_fk = b.lecture_pk and a_buy.user_fk = ?) as check_buy, a.user_pk, a.name, a.img, a.user_gb, a.farm_name, a.farm_img, b.lecture_pk, b.title, b.kind, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply
                    from farmer_info a 
                    join lecture b 
                    on a.user_pk = b.owner_fk
                    left outer join lecture_apply c
                    on c.lecture_fk = b.lecture_pk and c.user_fk = ?
                    where lecture_pk = ?
                    `;
                let select_result = await db.queryParamArr(select_query, [decoded.user_idx, decoded.user, req.params.id]);
                if (!select_result) {
                    res.status(500).json({
                        message : "Internal Server Error"
                    });
                } else  {
                    res.status(200).json({
                        message : "Success Get Lecture Detail",
                        data: select_result[0]
                    });
                }
            }
        } else {
            let select_query = `
            select a.user_pk, a.name, a.img, a.user_gb, a.farm_name, a.farm_img, b.lecture_pk, b.title, b.kind, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply
            from farmer_info a 
            join lecture b 
            on a.user_pk = b.owner_fk
            where lecture_pk = ?
            `;
            let select_result = await db.queryParamArr(select_query, [req.params.id]);
            if (!select_result) {
                res.status(500).json({
                    message : "Internal Server Error"
                });
            } else  {
                res.status(200).json({
                    message : "Success Get Lecture Detail",
                    data: select_result[0]
                });
            }
        }
    }


})

module.exports = router;
