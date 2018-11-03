"use strict";

const express = require('express'),
    router = express.Router();

const sign_up_new = require('./sign_up_new');
const sign_up = require('./sign_up');
const sign_in = require('./sign_in');
const dup_check = require('./dup_check');

router.use('/signupnew', sign_up_new);
router.use('/signup', sign_up);
router.use('/signin', sign_in);
router.use('/dupcheck', dup_check);
module.exports = router;