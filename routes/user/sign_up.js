"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    crypto = require('crypto-promise'),
    secret_key = require('../../config/secret_key'),
    upload = require('../../config/multer.js').upload,
    axios = require('axios'),
    fs = require('fs'),
    FormData = require('form-data');


router.post('/', async (req, res, next) => {
    let {
        mail,
        name,
        passwd,
        birth,
        sex,
        hp,
        wallet,
        key
    } = req.body;

    if (check.checkNull([
            mail,
            name,
            passwd,
            birth,
            sex,
            hp,
            wallet,
            key
        ])) {
        res.status(400).send({
            message: "Null Value"
        });
    } else {
        let check_query = `select * from user where mail = ?`;
        let check_result = await db.queryParamArr(check_query, [mail]);
        if (!check_result) { // 쿼리수행중 에러가 있을 경우
            res.status(500).send({
                message: "Internal Server Error"
            });
        } else if (check_result.length >= 1) { // 유저가 존재할 때, 프론트에서 중복 체크 해주지만, 혹시 모를 상황에 대비해 중복 검증하는 라우터
            res.status(200).send({
                message: "Already Exists"
            });
        } else {
            let network_server = `http://localhost:3000`;
            // let network_server = `http://52.78.62.162:3000`;
            // let network_server = `http://37196b19.ngrok.io`;

            axios.post(`${network_server}`, {
                key,
                mail
            }).then(async response => {
                console.log(response.data.message);
                if (response.data.message === "ok") {
                    const salt = await crypto.randomBytes(32);
                    const hashed_pw = await crypto.pbkdf2(passwd, salt.toString('base64'), 100000, 32, 'sha512');

                    let common_insert_query = `insert into user (mail, name, passwd, salt, birth, sex, hp, wallet_addr, user_gb) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    let insert_result1 = await db.queryParamArr(common_insert_query, [mail, name, hashed_pw.toString('base64'), salt.toString('base64'), birth, sex, hp, wallet, 2]);

                    let user_idx = insert_result1.insertId;
                    console.log(user_idx);
                    if (!insert_result1) { // 쿼리수행중 에러가 있을 경우
                        res.status(500).send({
                            message: "Internal Server Error"
                        });
                    } else {
                        res.status(200).send({
                            message: "Success To Sign Up"
                        })
                    }
                } else {
                    res.status(500).send({
                        message: "Internal Server Error"
                    })
                }
            });
        }
    }

});


/** @description 회원가입 - 농부 강사용
 * @method POST
 */
router.post('/farmer', async (req, res, next) => {
    let {
        mail,
        name,
        passwd,
        birth,
        sex,
        hp,
        career,
        wallet,
        private_key,
        farm_name,
        farm_num,
        farm_addr,
    } = req.body;

    if (check.checkNull([mail, name, passwd, birth, sex, career, wallet, private_key,
            farm_name,
            farm_num,
            farm_addr,
        ])) {
        res.status(400).send({
            message: "Null Value"
        })
    } else {
        let check_query = `select * from user where mail = ?`;
        let check_result = await db.queryParamArr(check_query, [mail]);

        if (!check_result) { // 쿼리수행중 에러가 있을 경우
            res.status(500).send({
                message: "Internal Server Error"
            });

        } else if (check_result.length >= 1) { // 유저가 존재할 때, 프론트에서 중복 체크 해주지만, 혹시 모를 상황에 대비해 죽복 검증하는 라우터
            res.status(200).send({
                message: "Already Exists"
            });

        } else {
            const salt = await crypto.randomBytes(32);
            const hashed_pw = await crypto.pbkdf2(passwd, salt.toString('base64'), 100000, 32, 'sha512');
            const cipher2 = await crypto.cipher('aes256', secret_key.key)(private_key);
            const cipher_result = cipher2.toString('base64');

            let common_insert_query = `insert into user (mail, name, passwd, salt, birth, sex, hp, wallet_addr, user_gb) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            let insert_result1 = await db.queryParamArr(common_insert_query, [mail, name, hashed_pw.toString('base64'), salt.toString('base64'), birth, sex, hp, wallet, 1]);

            if (!insert_result1) { // 쿼리수행중 에러가 있을 경우
                res.status(500).send({
                    message: "Internal Server Error"
                });
            } else {
                console.log(insert_result1.insertId);
                let user_idx = insert_result1.insertId;
                let farmer_insert_query = `insert into farmer (user_fk, career, private_key) values (?, ?, ?)`;
                let insert_result2 = await db.queryParamArr(farmer_insert_query, [user_idx, career, private_key]);
                if (!insert_result2) { // 쿼리수행중 에러가 있을 경우
                    res.status(500).send({
                        message: "Internal Server Error"
                    });
                } else {
                    console.log(insert_result2.insertId);
                    let farmer_idx = insert_result2.insertId;
                    let farm_insert_query = `insert into farm (farmer_fk, name, reg_num, addr) values (?, ?, ?, ?)`;
                    let insert_result3 = await db.queryParamArr(farm_insert_query, [farmer_idx, farm_name, farm_num, farm_addr]);
                    if (!insert_result3) { // 쿼리수행중 에러가 있을 경우
                        res.status(500).send({
                            message: "Internal Server Error"
                        });
                    } else {
                        res.status(200).send({
                            message: "Success To Sign Up"
                        });
                    }
                }
            }
        }
    }
});

module.exports = router;