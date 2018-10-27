"use strict";

const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    check = require('../../module/check'),
    crypto = require('crypto-promise'),
    jwt = require('../../module/jwt'),
    secret_key = require('../../config/secret_key');

router.post('/', async (req, res, next) => {
    let {
        idx,
        group
    } = req.body;

    if (group.length == 1) {

    }

});

module.exports = router;