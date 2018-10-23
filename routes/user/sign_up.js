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
    if (flag == 1) {
        console.log('농부 계정 가입');
    } else if (flag == 2) {
        console.log('일반 계정 가입');
    };

})


module.exports = router;