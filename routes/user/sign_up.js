"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction');

// /* GET home page. */
// router.get('/', (req, res, next) =>
//     res.render('index', {
//         title: 'Express'
//     }));

router.post('/', async (req, res, next) => {
    let {
        email,
        name,
        birth,
        sex,
        hp,
        addr
    } = req.body;
    // 기본 공통값 받고, Null 검사
    // 농부계정인지 일반계정인지 구분
    // 중복검사 쿼리수행
    // 통과 여부에 따라 패스워드 생성
    // 디비 저장 쿼리수행

    if (flag == 1) {
        console.log('농부 계정 가입');
    } else if (flag == 2) {
        console.log('일반 계정 가입');
    };

})


module.exports = router;