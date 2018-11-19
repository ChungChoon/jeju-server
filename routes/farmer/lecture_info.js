const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    jwt = require('../../module/jwt');

router.get('/:id', async (req, res, next) => {
    let lecture_id = req.params.id;
    let token = req.headers.token;

    if (check.checkNull([lecture_id, token])) {
        res.status(400).json({
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
        if (decoded === -1) {
            res.status(500).send({
                message: "token error"
            });
        } else {
            let check_auth = `select * from lecture where owner_fk =? and lecture_pk = ?`;
            let check_result = await db.queryParamArr(check_auth, [decoded.user_idx, lecture_id]);
            if (!check_result) {
                res.status(500).json({
                    message: "Internal Server Error"
                })
            }
            console.log(check_result.length);
            if (check_result.length === 0) {
                res.status(400).json({
                    message: "No Permission"
                })
            }
            else {
                let select_query = `select a.user_pk, a.mail, a.name, a.img, b.attend_cnt from user a, lecture_apply b where a.user_pk = b.user_fk and b.lecture_fk = ?`;
                let select_result = await db.queryParamArr(select_query, [lecture_id]);

                if (!select_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    })
                }
                else {
                    res.status(200).json({
                        message : "Success Get Apply Student Info",
                        data : select_result
                    })
                }
            }
        }
    }

});

module.exports = router;
