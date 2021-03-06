"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    crypto = require('crypto-promise'),
    secret_key = require('../../config/secret_key'),
    jwt = require('../../module/jwt');

/** @description 수강생 사용자로그인 - JWT 발급
 * @method POST
 */
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
            // console.log(check_result);
            let hashed_pw = await crypto.pbkdf2(passwd, check_result[0].salt, 100000, 32, 'sha512');
            if (hashed_pw.toString('base64') === check_result[0].passwd) {
                let token = jwt.sign(check_result[0].user_pk, check_result[0].mail);

                let result = [{
                    mail: check_result[0].mail,
                    name: check_result[0].name,
                    // private_key: decipher2.toString(),
                    wallet: check_result[0].wallet_addr,
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

/** @description 강사 사용자로그인 - JWT 발급, private_key 복호화 하여 제공
 * @method POST
 */
router.post('/farmer', async (req, res, next) => {
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
            let farmer_query = `select private_key from farmer where user_fk =?`;
            let key_result = await db.queryParamArr(farmer_query, [check_result[0].user_pk]);

            if (!key_result) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else {
                let hashed_pw = await crypto.pbkdf2(passwd, check_result[0].salt, 100000, 32, 'sha512');
                if (hashed_pw.toString('base64') === check_result[0].passwd) {
                    let token = jwt.sign(check_result[0].user_pk, check_result[0].mail);
                    const decipher2 = await crypto.decipher('aes256', secret_key.key)(key_result[0].private_key, 'base64');

                    let result = [{
                        mail: check_result[0].mail,
                        name: check_result[0].name,
                        private_key: decipher2.toString(),
                        wallet: check_result[0].wallet_addr,
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
            }
        } else {
            res.status(401).send({
                message: "Fail To Sign In"
            });
            console.log("id error");
        }
    }

});

/** @description admin - JWT 발급, private_key 복호화 하여 제공
 * @method POST
 */
router.post('/admin', async (req, res, next) => {
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
                let hashed_pw = await crypto.pbkdf2(passwd, check_result[0].salt, 100000, 32, 'sha512');
                if (hashed_pw.toString('base64') === check_result[0].passwd) {
                    let token = jwt.sign(check_result[0].user_pk, check_result[0].mail);

                    let result = [{
                        mail: check_result[0].mail,
                        name: check_result[0].name,
                        wallet: check_result[0].wallet_addr,
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
