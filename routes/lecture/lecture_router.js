"use strict";

const express = require('express'),
    router = express.Router();

const lecture_create = require('./lecture_create');

router.use('/create', lecture_create);

module.exports = router;