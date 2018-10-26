"use strict";

const express = require('express'),
    router = express.Router();

const lecture_create = require('./lecture_create');

router.use('/create', lecture_create);

router.get('/', async (req, res, next) => {
    let select_query = `select * from lecuture`;

})

module.exports = router;