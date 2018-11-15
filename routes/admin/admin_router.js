const express = require('express'),
    router = express.Router(),
    db = require('../../module/db_transction'),
    jwt = require('../../module/jwt'),
    caver_js = require('caver-js'),
    caver = new caver_js('http://klaytn.ngrok.io');

router.post('/', async (req, res, next) => {
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
                let check_result = await db.queryParamArr(auth_check, [decoded.user_idx]);
                if (!check_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
                } else if (check_result !== 3) {
                    res.status(200).json({
                        message: "No permission "
                    });
                } else {
                    // let estimate_gas = caver.klay.Contract.methods.estimateGas()
                    // caver.klay.getCode(addr).then(console.log);
                    // const jeju_contract = new caver.klay.Contract(jeju.abi, addr);
                    // jeju_contract.methods.acceptAdmin(lecture_id).send({
                    //         from: addr,
                    //         gas:
                    //     })
                    //     .on('receipt', function (receipt) {
                    //         console.log(receipt);
                    //         let transactionHash = receipt.transactionHash; // Get transactionHash from receipt
                    //         console.log(transactionHash);
                    //         caver.klay.getTransaction(transactionHash).then(function (transaction) {
                    //             console.log(transaction.input); // Get transaction.input(hex)
                    //             console.log(caver.utils.hexToAscii(transaction.input));
                    //         });
                    //     });
                }
            }
        }
    }
});

module.exports = router;