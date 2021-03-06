const express = require("express"),
    router = express.Router(),
    db = require("../../module/db_transction"),
    jwt = require("../../module/jwt");
const caver_js = require("caver-js");
//     const web3 = require('web3-js');
    const caver = new caver_js("http://localhost:8551");
//     const caver = new caver_js("http://5d7b917b.ngrok.io");
    const contract = require("../../contract/abi/chungchul.json");
//     const web3_js = new web3("http://localhost:8551");
//     const contract = require("../../contract/abi/chungchul.json");
//
//최초 계약배포자 주소
let addmin_addr = `0xb0ab2e7fb5a876c2cfb67250f83739d526d86b7c`;

//배포된 계약 주소
let contract_addr = "0xfa05a3cc1c985b92a58d466ef336287d0a139891";
//컨트랙트 설정
const jeju_contract = new caver.klay.Contract(
    contract.abi,
    contract_addr
);
// const jeju_contract = new web3_js.eth.Contract(
//     contract.abi,
//     contract_addr
// );
//
// router.get('/', async (req, res, next) => {
//     let token = req.headers.token;
//     if (!token) {
//         res.status(400).json({
//             message: "No Token"
//         });
//     } else {
//         let decoded = jwt.verify(token);
//         if (decoded === 10) {
//             res.status(500).send({
//                 message: "token err", //여기서 400에러를 주면 클라의 문제니까 메세지만 적절하게 잘 바꿔주면 된다.
//                 expired: 1
//             });
//             return;
//         }
//         if (decoded === -1) {
//             res.status(500).send({
//                 message: "token error"
//             });
//         }
//         else {
//             //실제 어드민 계정인지 확인
//         }
//     }
// })
//
//
/** @description 어드민계정 - 강의평가에 따른 인센티브 지급 컨트랙트 연동
 * @method POST
 */
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
                let auth_check = `select * from admin where admin = ?`;
                let check_result = await db.queryParamArr(auth_check, [
                    decoded.user_idx
                ]);
                if (!check_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    });
                } else if (check_result[0].admin !== decoded.user_idx) {
                    res.status(200).json({
                        message: "No permission "
                    });
                } else {
                    // let gas_limit = 75000;
                    // caver.klay.getCode(0x815481ca8d4d0d916a7e1ed9a2fe2be1ee42a5b8).then(console.log);

                    // let estimate_gas = jeju_contract.methodss
                    //     .acceptAdmin(lecture_id)
                    //     .estimate_gas();
                    // console.log(estimate_gas);
                    jeju_contract.methods
                        .acceptAdmin(lecture_id)
                        .send({
                            from: addmin_addr,
                            gas: 750000
                        })
                        .on("receipt", function (receipt) {
                            console.log(receipt);
                            let transactionHash = receipt.transactionHash; // Get transactionHash from receipt
                            console.log(transactionHash);
                            caver.klay
                                .getTransaction(transactionHash)
                                .then(function (transaction) {
                                    console.log(transaction.input); // Get transaction.input(hex)
                                    console.log(caver.utils.hexToAscii(transaction.input));
                                    res.status(200).json({
                                        message: "success"
                                    });
                                });
                        })
                        .on("error", function (error) {
                            res.status(500).json({
                                message: "Internal Server Error"
                            });
                        });
                }
            }
        }
    }
});


/** @description 어드민 계정으로 로그인 할 경우 강의평가가 완료된 강의리스트를 보여준다.
 * @method GET
 */
router.get('/', async (req, res, next) => {

    let token = req.headers.token;
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
        }
        else {
            //admin 권한체크
            let auth_check = `select * from admin where admin = ?`;
            let check_result = await db.queryParamArr(auth_check, [
                decoded.user_idx
            ]);
            if (!check_result) {
                res.status(500).json({
                    message: "Internal Server Error"
                });
            } else if (check_result[0].admin !== decoded.user_idx) {
                res.status(200).json({
                    message: "No permission "
                });
            }
            else {
                let select_query = `
                select a.user_pk, a.mail, a.name, date_format(a.birth, "%Y-%m-%d") as birth, a.sex, a.hp, a.img, a.wallet_addr, a.user_gb, a.farmer_career, a.farm_name, a.reg_num, a.farm_pk, a.farm_addr, a.subject, a.kind, a.farm_img, b.lecture_pk, b.title, b.target, b.kind, b.period, date_format(b.start_date, "%Y-%m-%d") as start_date, date_format(b.end_date, "%Y-%m-%d") as end_date, date_format(b.reg_date, "%Y-%m-%d") as reg_date, b.img, b.place, b.intro, b.limit_num, b.price, b.curri_count, b.apply
                from farmer_info a, lecture b, lecture_complete c
                where b.owner_fk = a.user_pk and c.lecture_fk = b.lecture_pk and c.status = 1;
                `
                let select_result = await db.queryParamNone(select_query);
                if (!select_result) {
                    res.status(500).json({
                        message: "Internal Server Error"
                    })
                }
                else {
                    res.status(200).json({
                        message: "Success",
                        data: select_result
                    })
                }
            }
        }
    }
})

module.exports = router;
