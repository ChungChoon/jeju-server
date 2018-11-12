const express = require('express'),
    router = express.Router(),
    upload = require('../../config/multer.js').upload,
    FormData = require('form-data'),
    fetch = require('node-fetch'),
    fs = require('fs'),
    path = require('path');
var exec = require("child_process").exec;



// router.post('/', upload.single('keyFile'), async (req, res, next) => {
//     // if (error) {
//     //     console.log(error)
//     // }
//     let {mail, name} = req.body;
//     console.log(name);
//     console.log(req.file);
//     res.status(200).json({
//         message: req.file
//     })
// });

router.post('/', upload.single('keyFile'), async (req, res, next) => {
    var form = new FormData();
    form.append('keyFile', '{"version":3,"id":"018a2552-36d5-4f9d-a1f4-bf399cb52e39","crypto":{"ciphertext":"09396c0d934aa5ecb44b8fa055d5e702f4403c877df60efa72fd8811226efab4","cipherparams":{"iv":"e6708c4cc9caa064c8e4f5a7bb195774"},"kdf":"scrypt","kdfparams":{"r":6,"p":1,"n":4096,"dklen":32,"salt":"f0b76e5cba41b162c45c91900d82c119e1785396423a3b1f6b276712dd124fae"},"mac":"b8a19f24b56f444964187d5bef7fdaefe3c9752a3ce4aa346d7a1ac87ffec96a","cipher":"aes-128-ctr"},"address":"0xf694888fc6eea44f8cd03e9c5f18af8f61bdebe8"}');
    // var FormData = {
    //     my_field: 'my_value',
    //     my_file: fs.createReadStream(__dirname, 'uploads/test3.json'),
    // };
    // my_file: fs.createReadStream(__dirname + '/unicycle.jpg'),
    fetch('http://52.78.62.162:3000', { method: 'POST', body: form })
        .then(function(res) {
            return res.json();
        }).then(function(json) {
        console.log(json);
    });
});

module.exports = router;
