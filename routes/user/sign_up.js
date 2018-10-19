"use strict";

const express = require('express'),
    router = express.Router();

// /* GET home page. */
// router.get('/', (req, res, next) =>
//     res.render('index', {
//         title: 'Express'
//     }));

router.post('/', async (req, res, next) => {
    let email = req.body.email;
})


module.exports = router;