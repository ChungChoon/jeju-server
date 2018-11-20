"use strict";

const express = require("express"),
  router = express.Router(),
  db = require("../../module/db_transction"),
  jwt = require("../../module/jwt");

const sign_up = require("./sign_up");
const sign_in = require("./sign_in");
const dup_check = require("./dup_check");
const faucet = require("./faucet");

router.use("/signup", sign_up);
router.use("/signin", sign_in);
router.use("/dupcheck", dup_check);
router.use("/faucet", faucet);

router.get("/", async (req, res, next) => {
  let token = req.headers.token;

  if (!token) {
    res.status(400).send({
      message: "fail to show mypage from client, Null value"
    });
  } else {
    let decoded = jwt.verify(token);
    if (decoded === 10) {
      res.status(500).send({
        message: "token err", //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
        expired: 1
      });

      return;
    }
    if (decoded === -1) {
      res.status(500).send({
        message: "token error"
      });
    } else {
      let select_user = `select * `;
    }
  }
});

module.exports = router;
