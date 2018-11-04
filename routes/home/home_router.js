"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    jwt = require('../../module/jwt');

const filter_lecture = require('./filter_lecture');

router.use('/filter', filter_lecture);

router.get('/', async (req, res, next) => {
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
            let popular_query = `
                        select(select count( * ) as buy_count from lecture_apply as a_buy where a_buy.lecture_fk = b.lecture_pk and a_buy.user_fk = ? ) as check_buy, a.user_pk, a.mail, a.name, date_format(a.birth, "%Y-%m-%d") as birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, a.farmer_career, a.farm_name, a.reg_num, a.farm_pk, a.farm_addr, a.subject, a.kind, a.farm_img, b.lecture_pk, b.title, b.target, b.kind, b.period, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply
                        from farmer_info a, lecture b, lecture_owner c
                        where a.user_pk = c.user_fk and b.lecture_pk = c.lecture_fk
                        order by apply
                        limit 6
                        `;
            let offline_query = `
                        select(select count( * ) as buy_count from lecture_apply as a_buy where a_buy.lecture_fk = b.lecture_pk and a_buy.user_fk = ? ) as check_buy, a.user_pk, a.mail, a.name, date_format(a.birth, "%Y-%m-%d") as birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, a.farmer_career, a.farm_name, a.reg_num, a.farm_pk, a.farm_addr, a.subject, a.kind, a.farm_img, b.lecture_pk, b.title, b.target, b.kind, b.period, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply
                        from farmer_info a, lecture b, lecture_owner c 
                        where a.user_pk = c.user_fk  and b.lecture_pk = c.lecture_fk and b.kind in (3, 4, 5, 6, 7)
                        `;
            let online_query = `
                        select(select count( * ) as buy_count from lecture_apply as a_buy where a_buy.lecture_fk = b.lecture_pk and a_buy.user_fk = ? ) as check_buy, a.user_pk, a.mail, a.name, date_format(a.birth, "%Y-%m-%d") as birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, a.farmer_career, a.farm_name, a.reg_num, a.farm_pk, a.farm_addr, a.subject, a.kind, a.farm_img, b.lecture_pk, b.title, b.target, b.kind, b.period, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply
                        from farmer_info a, lecture b, lecture_owner c 
                        where a.user_pk = c.user_fk  and b.lecture_pk = c.lecture_fk and b.kind in (8, 9, 10, 11)
                        `;

            let popular_result = await db.queryParamArr(popular_query, [decoded.user_idx]);
            let offline_result = await db.queryParamArr(offline_query, [decoded.user_idx]);
            let online_result = await db.queryParamArr(online_query, [decoded.user_idx]);

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
        }
    }

});
// router.get('/', async (req, res, next) => {
//     // let popular_query = `select a.user_pk, a.mail, a.name, a.birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, a.farmer_career, a.farm_name, a.reg_num, a.farm_pk, a.farm_addr, a.subject, a.kind, a.farm_img, b.* from farmer_info a, lecture b, lecture_owner c where a.user_pk = c.user_fk order by apply limit 6;`;
//     let popular_query = `
//         select a.user_pk, a.mail, a.name, date_format(a.birth, "%Y-%m-%d") as birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, a.farmer_career, a.farm_name, a.reg_num, a.farm_pk, a.farm_addr, a.subject, a.kind, a.farm_img, b.title, b.target, b.kind, b.period, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply 
//         from farmer_info a, lecture b, lecture_owner c 
//         where a.user_pk = c.user_fk  and b.lecture_pk = c.lecture_fk
//         order by apply 
//         limit 6
//         `;
//     let offline_query = `
//         select a.user_pk, a.mail, a.name, date_format(a.birth, "%Y-%m-%d") as birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, a.farmer_career, a.farm_name, a.reg_num, a.farm_pk, a.farm_addr, a.subject, a.kind, a.farm_img, b.title, b.target, b.kind, b.period, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply 
//         from farmer_info a, lecture b, lecture_owner c 
//         where a.user_pk = c.user_fk  and b.lecture_pk = c.lecture_fk and b.kind in (3, 4, 5, 6, 7)
//         `;
//     let online_query = `
//         select a.user_pk, a.mail, a.name, date_format(a.birth, "%Y-%m-%d") as birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, a.farmer_career, a.farm_name, a.reg_num, a.farm_pk, a.farm_addr, a.subject, a.kind, a.farm_img, b.title, b.target, b.kind, b.period, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply 
//         from farmer_info a, lecture b, lecture_owner c 
//         where a.user_pk = c.user_fk  and b.lecture_pk = c.lecture_fk and b.kind in (8, 9, 10, 11)
//         `;
//     let popular_result = await db.queryParamNone(popular_query);
//     let offline_result = await db.queryParamNone(offline_query);
//     let online_result = await db.queryParamNone(online_query);

//     if (!popular_result || !offline_result || !online_result) {
//         res.status(500).json({
//             message: "Internal Server Error"
//         });
//     } else {
//         res.status(200).json({
//             message: "Success To Get Information",
//             popular: popular_result,
//             offline: offline_result,
//             online: online_result
//         })
//     }
// });

//모바일의 경우
router.get('/m', async (req, res, next) => {

});

//WEB의 경우
router.get('/p', async (req, res, next) => {

});

module.exports = router;