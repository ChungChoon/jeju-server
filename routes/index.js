"use strict";

const express = require('express'),
  router = express.Router();

// /* GET home page. */
// router.get('/', (req, res, next) =>
//   res.render('index', {
//     title: 'Express'
//   }));

const user_router = require('./user/user_router');

router.use('/user', user_router);

module.exports = router;