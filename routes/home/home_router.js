"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    jwt = require('../../module/jwt');

// const sign_up = require('./sign_up');

// router.use('/signup', sign_up);


router.get('/', async (req, res, next) => {

});

module.exports = router;