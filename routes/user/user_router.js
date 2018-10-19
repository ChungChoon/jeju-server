"use strict";

const express = require('express'),
    router = express.Router();

const sign_up = require('./sign_up');
const sign_in = require('./sign_in');

router.use('/sign_up', sign_up);
router.use('/sign_in', sign_in);

module.exports = router;