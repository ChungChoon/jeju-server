"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    crypto = require('crypto-promise');

// /* GET home page. */
// router.get('/', (req, res, next) =>
//     res.render('index', {
//         title: 'Express'
//     }));


// router.post('/', async (req, res, next) => {
//     let {
//         mail,
//         name,
//         passwd,
//         birth,
//         sex,
//         hp,
//         flag
//     } = req.body;

//     // 기본 공통값 받고, Null 검사
//     // 농부계정인지 일반계정인지 구분
//     // 중복검사 쿼리수행
//     // 통과 여부에 따라 패스워드 생성
//     // 디비 저장 쿼리수행

//     if (flag == 1) {
//         console.log('농부 계정 가입');
//     } else if (flag == 2) {
//         console.log('일반 계정 가입');
//     };

// })

router.get('/', async (req, res, next) => {
    const cipher = crypto.createCipher('aes-256-cbc', '열쇠');
    let result = cipher.update('암호화할문장', 'utf8', 'base64'); // 'HbMtmFdroLU0arLpMflQ'
    result += cipher.final('base64'); // 'HbMtmFdroLU0arLpMflQYtt8xEf4lrPn5tX5k+a8Nzw='

    const decipher = crypto.createDecipher('aes-256-cbc', '열쇠');
    let result2 = decipher.update(result, 'base64', 'utf8'); // 암호화할문 (base64, utf8이 위의 cipher과 반대 순서입니다.)
    result2 += decipher.final('utf8'); // 암호화할문장 (여기도 base64대신 utf8)

    console.log(result);
    console.log(result2);
});

router.post('/', async (req, res, next) => {
    let {
        mail,
        name,
        passwd,
        birth,
        sex,
        hp,
        hope,
        interest
    } = req.body;

    if (check.checkNull([mail, name, passwd, birth, sex, hope, interest])) {
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

            let common_insert_query = `insert into user (mail, name, passwd, salt, birth, sex, hp, wallet_addr, user_gb) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            let insert_result1 = await db.queryParamArr(common_insert_query, [mail, name, hashed_pw.toString('base64'), salt.toString('base64'), birth, sex, hp, '12134', 2]);

            if (!insert_result1) { // 쿼리수행중 에러가 있을 경우
                res.status(500).send({
                    message: "Internal Server Error"
                });
            } else {
                console.log(insert_result1.insertId);
                let user_idx = insert_result1.insertId;
                let student_insert_query = `insert into student (user_fk, hope, interest) values (?, ?, ?)`;
                let insert_result2 = await db.queryParamArr(student_insert_query, [user_idx, hope, interest]);
                if (!insert_result2) { // 쿼리수행중 에러가 있을 경우
                    res.status(500).send({
                        message: "Internal Server Error"
                    });
                } else {
                    res.status(200).send({
                        message: "Success To Sign Up"
                    })
                }
            }
        }
    }
});

router.post('/farmer', async (req, res, next) => {
    let {
        mail,
        name,
        passwd,
        birth,
        sex,
        hp,
        career,
        farm_name,
        farm_num,
        farm_addr,
        farm_kind,
    } = req.body;

    if (check.checkNull([mail, name, passwd, birth, sex, career])) {
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

            let common_insert_query = `insert into user (mail, name, passwd, salt, birth, sex, hp, wallet_addr, user_gb) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            let insert_result1 = await db.queryParamArr(common_insert_query, [mail, name, hashed_pw.toString('base64'), salt.toString('base64'), birth, sex, hp, '12134', 1]);

            if (!insert_result1) { // 쿼리수행중 에러가 있을 경우
                res.status(500).send({
                    message: "Internal Server Error"
                });
            } else {
                console.log(insert_result1.insertId);
                let user_idx = insert_result1.insertId;
                let farmer_insert_query = `insert into farmer (user_fk, career) values (?, ?)`;
                let insert_result2 = await db.queryParamArr(farmer_insert_query, [user_idx, career]);
                if (!insert_result2) { // 쿼리수행중 에러가 있을 경우
                    res.status(500).send({
                        message: "Internal Server Error"
                    });
                } else {
                    res.status(200).send({
                        message: "Success To Sign Up"
                    })
                }
            }
        }
    }
});


module.exports = router;