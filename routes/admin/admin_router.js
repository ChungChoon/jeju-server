const express = require("express"),
  router = express.Router(),
  db = require("../../module/db_transction"),
  jwt = require("../../module/jwt"),
  caver_js = require("caver-js"),
  caver = new caver_js("http://localhost:8551");
// caver = new caver_js('http://klaytn.ngrok.io');

let addmin_addr = `0x7847b04133c7023a7481668e3d0dc18c34b7356d`;

router.post("/", async (req, res, next) => {
  let token = req.headers.token;
  let lecture_id = req.body.lecture_id;
  if (!token) {
    res.status(400).json({
      message: "No Token"
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
      if (!lecture_id) {
        res.status(400).send({
          message: "Null Value"
        });
      } else {
        let auth_check = `select user_gb from where user_pk = ?`;
        let check_result = await db.queryParamArr(auth_check, [
          decoded.user_idx
        ]);
        if (!check_result) {
          res.status(500).json({
            message: "Internal Server Error"
          });
        } else if (check_result !== 3) {
          res.status(200).json({
            message: "No permission "
          });
        } else {
          // let gas_limit = 75000;
          // let estimate_gas = caver.klay.estimateGas({
          //         to: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", //계약주소
          //         data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
          //     })
          //     .then(console.log);
          caver.klay.getCode(addr).then(console.log);
          const jeju_contract = new caver.klay.Contract(jeju.abi, addr);
          let estimate_gas = jeju_contract.methods
            .acceptAdmin(lecture_id)
            .estimate_gas();
          jeju_contract.methods
            .acceptAdmin(lecture_id)
            .send({
              from: addmin_addr,
              gas: estimate_gas
            })
            .on("receipt", function(receipt) {
              console.log(receipt);
              let transactionHash = receipt.transactionHash; // Get transactionHash from receipt
              console.log(transactionHash);
              caver.klay
                .getTransaction(transactionHash)
                .then(function(transaction) {
                  console.log(transaction.input); // Get transaction.input(hex)
                  console.log(caver.utils.hexToAscii(transaction.input));
                  res.status(200).json({
                    message: "success"
                  });
                });
            })
            .on("error", function(error) {});
        }
      }
    }
  }
});

module.exports = router;
