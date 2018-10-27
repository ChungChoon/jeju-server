"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    jwt = require('../../module/jwt');

// const sign_up = require('./sign_up');

// router.use('/signup', sign_up);

router.get('/', async (req, res, next) => {
    let popular_query = `select a.user_pk, a.mail, a.name, a.birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, b.* from farmer_info a, lecture b, lecture_owner c where a.user_pk = c.user_fk order by apply limit 6;`;
    let offline_query = `select a.user_pk, a.mail, a.name, a.birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, b.* from farmer_info a, lecture b, lecture_owner c where a.user_pk = c.user_fk and b.kind in (3, 4, 5, 6, 7)`;
    let online_query = `select a.user_pk, a.mail, a.name, a.birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, b.* from farmer_info a, lecture b, lecture_owner c where a.user_pk = c.user_fk and b.kind in (8, 9, 10, 11)`;
    let popular_result = await db.queryParamNone(popular_query);
    let offline_result = await db.queryParamNone(offline_query);
    let online_result = await db.queryParamNone(online_query);

    if (!popular_result || !offline_result || !online_result) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    } else {
        res.status(200).json({
            message: "Success To Get Information",
            popular: popular_result,
            offline: offline_result,
            online: online_result
        })
    }
});

//모바일의 경우
router.get('/m', async (req, res, next) => {

});

//WEB의 경우
router.get('/p', async (req, res, next) => {

});

module.exports = router;