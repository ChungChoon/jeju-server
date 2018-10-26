"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    crypto = require('crypto-promise'),
    secret_key = require('../../config/secret_key'),
    jwt = require('../../module/jwt');

//사용자 로그인
router.post('/', async (req, res, next) => {
    let {
        mail,
        passwd
    } = req.body;

    if (check.checkNull([mail, passwd])) {
        res.status(400).json({
            message: "Null Value"
        })
    } else {
        let check_query = `select * from user where mail = ?;`;
        let check_result = await db.queryParamArr(check_query, [mail]);

        if (!check_result) {
            res.status(500).json({
                message: "Internal Server Error"
            });
        } else if (check_result.length === 1) {
            console.log(secret_key.key);

            const cipher = await crypto.cipher('aes256', secret_key.key)(passwd);
            if (cipher.toString('hex') === check_result[0].passwd) {
                let token = jwt.sign(check_result[0].user_pk, check_result[0].mail);
                console.log(check_result);
                const decipher1 = await crypto.decipher('aes256', secret_key.key)(check_result[0].passwd, 'hex')
                const decipher2 = await crypto.decipher('aes256', secret_key.key)(check_result[0].private_key, 'hex')

                let result = [{
                    mail: check_result[0].mail,
                    name: check_result[0].name,
                    passwd: decipher1.toString(),
                    private_key: decipher2.toString(),
                    birth: check_result[0].birth,
                    sex: check_result[0].sex,
                    hp: check_result[0].hp,
                    img: check_result[0].img,
                    flag: check_result[0].user_gb
                }];

                res.status(200).send({
                    message: "Success To Sign In",
                    token: token,
                    data: result
                });
            } else {
                res.status(401).send({
                    message: "Fail To Sign In"
                });
                console.log("password error");
            }
        } else {
            res.status(401).send({
                message: "Fail To Sign In"
            });
            console.log("id error");
        }
    }

});

module.exports = router;