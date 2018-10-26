"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    jwt = require('../../module/jwt');

// const sign_up = require('./sign_up');

// router.use('/signup', sign_up);

router.get('/m', async (req, res, next) => {

});

//모바일의 경우
router.get('/m', async (req, res, next) => {

});

//WEB의 경우
router.get('/p', async (req, res, next) => {

});

module.exports = router;