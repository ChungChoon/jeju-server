const express = require("express"),
    router = express.Router(),
    db = require("../../module/db_transction"),
    jwt = require("../../module/jwt");

router.get('/', async (req, res, next) => {

    let token = req.headers.token;
    if (!token) {
        res.status(400).json({
            message: "No Token"
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
        }
        else {
            //admin 권한체크
            let auth_check = `select * from admin where admin = ?`;
            let check_result = await db.queryParamArr(auth_check, [
                decoded.user_idx
            ]);
            if (!check_result) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else if (check_result[0].admin !== decoded.user_idx) {
                res.status(200).json({
                    message: "No permission "
                });
            }
            else {
                let select_query = `
                select a.user_pk, a.mail, a.name, date_format(a.birth, "%Y-%m-%d") as birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, a.farmer_career, a.farm_name, a.reg_num, a.farm_pk, a.farm_addr, a.subject, a.kind, a.farm_img, b.lecture_pk, b.title, b.target, b.kind, b.period, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.intro, b.limit_num, b.price, b.curri_count, b.apply
                from farmer_info a, lecture b, lecture_complete c
                where b.owner_fk = a.user_pk and c.lecture_fk = b.lecture_pk and c.status = 1;
                `
                let select_result = await db.queryParamNone(select_query);
                if (!select_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    })
                }
                else {
                    res.status(200).json({
                        message: "Success",
                        data: select_result
                    })
                }
            }
        }
    }
})

module.exports = router;
