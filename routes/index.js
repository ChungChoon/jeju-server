"use strict";

const express = require('express'),
  router = express.Router();

// /* GET home page. */
// router.get('/', (req, res, next) =>
//   res.render('index', {
//     title: 'Express'
//   }));

const user_router = require('./user/user_router');
const home_router = require('./home/home_router');
const lecture_router = require('./lecture/lecture_router');
const farmer_router = require('./farmer/farmer_router');
const student_router = require('./student/student_router');
const network = require('./network/test');

router.use('/user', user_router);
router.use('/home', home_router);
router.use('/lecture', lecture_router);
router.use('/farmer', farmer_router);
router.use('/student', student_router);
router.use('/network', network);

module.exports = router;