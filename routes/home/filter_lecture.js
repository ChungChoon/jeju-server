"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    crypto = require('crypto-promise'),
    jwt = require('../../module/jwt'),
    secret_key = require('../../config/secret_key');

/** @description main filter
 * @param kind ID, token
 */
router.get('/:kind', async (req, res, next) => {
    let kind_id = req.params.kind;

    let token = req.headers.token;

    if (check.checkNull(kind_id)) {
        res.status(400).json({
            message: "Null Value"
        });
    }

    else {
        //로그인 한 사용자일 경우 구매여부, 출석률 합께 줘야함
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
            }
            else {
                let select_query = `
                        select c.attend_cnt, (select count( * ) as buy_count from lecture_apply as a_buy where a_buy.lecture_fk = b.lecture_pk and a_buy.user_fk = ?) as check_buy, a.user_pk, a.name, a.img, a.user_gb, a.farm_name, a.farm_img, b.lecture_pk, b.title, b.kind, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply
                        from farmer_info a 
                        join lecture b 
                        on a.user_pk = b.owner_fk and b.kind  = ?
                        left outer join lecture_apply c
                        on c.lecture_fk = b.lecture_pk and c.user_fk = ?
                        order by apply desc
                        `;
                let select_result = await db.queryParamArr(select_query, [decoded.user_idx, kind_id, decoded.user_idx]);

                if (!select_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
                }
                else {
                    res.status(200).json({
                        message: "Success Get Filter Data",
                        data: select_result
                    })
                }
            }
        }

        else {
            let select_query = `
                        select a.user_pk, a.name, a.img, a.user_gb, a.farm_name, a.farm_img, b.lecture_pk, b.title, b.kind, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.curriculum, b.intro, b.limit_num, b.price, b.apply
                        from farmer_info a 
                        join lecture b 
                        on a.user_pk = b.owner_fk and b.kind  = ?
                        order by apply desc
                        `;
            let select_result = await db.queryParamArr(select_query, [kind_id]);

            if (!select_result) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            }
            else {
                res.status(200).json({
                    message: "Success Get Filter Data",
                    data: select_result
                })
            }
        }
    }

});

module.exports = router;
