"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction');

const lecture_create = require('./lecture_create');
const lecture_apply = require('./lecture_apply');
const lecture_attend = require('./lecture_attend');
const lecture_vote = require('./lecture_vote');

router.use('/create', lecture_create);
router.use('/apply', lecture_apply);
router.use('/attend', lecture_attend);
router.use('/vote', lecture_vote);

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

module.exports = router;