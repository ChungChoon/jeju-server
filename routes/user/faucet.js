"use strict";

const express = require('express'),
    router = express.Router(),
    axios = require('axios');

router.post('/', async (req, res, status) => {
    let addr = req.body.addr;
    let faucet_addr = `https://apiwallet.klaytn.com/faucet?address=${addr}`;
    await axios.get(`${faucet_addr}`).then(async response => {
        console.log(response.data.status);
        if (response.data.status === "ok") {
            res.status(200).json({
                message: "success"
            })
        }
        else {
            res.status(500).json({
                message: "fail"
            })
        }
    })
});

module.exports = router;
