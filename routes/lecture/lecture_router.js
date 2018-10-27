"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction');

const lecture_create = require('./lecture_create');

router.use('/create', lecture_create);

router.get('/', async (req, res, next) => {
    let select_query = `select a.user_pk, a.mail, a.name, a.birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, b.* from farmer_info a, lecture b, lecture_owner c where a.user_pk = c.user_fk and c.lecture_fk =b.lecture_pk`;
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