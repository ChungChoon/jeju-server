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

/** @description 강의 상세조회 (로그인 여부에 따라 신청여부, 출석률을 추가적으로 보여준다.)
 * @method GET
 */
router.get('/:lectureId', async (req, res, next) => {
    let token = req.headers.token;
    let lecture_id = req.params.lectureId;
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
                    select c.attend_cnt, (select count( * ) as buy_count from lecture_apply as a_buy where a_buy.lecture_fk = b.lecture_pk and a_buy.user_fk = ?) as check_buy, a.user_pk, a.name, a.img, a.user_gb, a.farm_name, a.farm_img, b.lecture_pk, b.curri_count, b.title, b.kind, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.intro, b.limit_num, b.price, b.apply
                    from farmer_info a 
                    join lecture b 
                    on a.user_pk = b.owner_fk
                    left outer join lecture_apply c
                    on c.lecture_fk = b.lecture_pk and c.user_fk = ?
                    where lecture_pk = ?
                    `;
                let select_result = await db.queryParamArr(select_query, [decoded.user_idx, decoded.user, lecture_id]);
                if (!select_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
                } else {
                    let select_query2 = `
                    select a.user_pk, a.name, a.img, b.content, date_format(b.written_date, "%Y-%m-%d") as written_date 
                    from user a, lecture_review b
                    where a.user_pk = b.user_fk and b.lecture_fk = ?
                    `;
                    let select_result2 = await db.queryParamArr(select_query2, [lecture_id]);
                    if (!select_result) {
                        res.status(500).json({
                            message: "Internal Server Error"
                        });
                    } else {
                        let select_curriculum = `
                        select a.title, b.content 
                        from curri_title a, curri_content b 
                        where a.lecture_fk = ? and b.lecture_fk = ? and a.title_cnt = b.content_cnt`;
                        let curriculum_result = await db.queryParamArr(select_curriculum, [lecture_id, lecture_id]);
                        if (!curriculum_result) {
                            res.status(500).json({
                                message: "Internal Server Error"
                            });
                        } else {
                            res.status(200).json({
                                message: "Success Get Lecture Detail",
                                lecture_data: select_result[0],
                                review_data: select_result2,
                                curriculum_data: curriculum_result
                            });
                        }
                    }
                }
            }
        } else {
            let select_query = `
            select a.user_pk, a.name, a.img, a.user_gb, a.farm_name, a.farm_img, b.lecture_pk, b.curri_count, b.title, b.kind, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.intro, b.limit_num, b.price, b.apply
            from farmer_info a 
            join lecture b
            on a.user_pk = b.owner_fk
            where lecture_pk = ?
            `;
            let select_result = await db.queryParamArr(select_query, [lecture_id]);
            if (!select_result) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else {
                let select_query2 = `
                    select a.user_pk, a.name, a.img, b.content, date_format(b.written_date, "%Y-%m-%d") as written_date 
                    from user a, lecture_review b 
                    where a.user_pk = b.user_fk and b.lecture_fk = ?
                    `;
                let select_result2 = await db.queryParamArr(select_query2, [lecture_id]);
                if (!select_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
                } else {
                    let select_curriculum = `
                        select a.title, b.content 
                        from curri_title a, curri_content b 
                        where a.lecture_fk = ? and b.lecture_fk = ? and a.title_cnt = b.content_cnt`;
                    let curriculum_result = await db.queryParamArr(select_curriculum, [lecture_id, lecture_id]);
                    if (!curriculum_result) {
                        res.status(500).json({
                            message: "Internal Server Error"
                        });
                    } else {
                        res.status(200).json({
                            message: "Success Get Lecture Detail",
                            lecture_data: select_result[0],
                            review_data: select_result2,
                            curriculum_data: curriculum_result
                        });
                    }
                }
            }
        }
    }
})

module.exports = router;