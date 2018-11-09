const express = require('express'),
    router = express.Router(),
    upload = require('../../config/multer.js').upload;
var exec = require("child_process").exec;



router.post('/', upload.single('keyFile'), async (req, res, next) => {
    // if (error) {
    //     console.log(error)
    // }
    let {mail, name} = req.body;
    console.log(name);
    console.log(req.file);
    res.status(200).json({
        message: req.file
    })
});

router.get('/', function (req, res, next) {
    console.log('xk/?????');

    let cmd = `cd ./bc_network`;
    // exec(cmd, function (err, stdout, stderr) {
    //     console.log(stdout);
    //     cmd = `sh init.sh`;
    //     exec(cmd, function (err, stdout, stderr) {
    //         console.log(stdout);
    //     });

    //     //Print stdout/stderr to console

    //     console.log(stdout);

    //     console.log(stderr);

    //     //Simple response to user whenever localhost:3003 is accessed

    //     res.render('cmd', {
    //         title: 'Express',
    //         data: stdout
    //     });

    // });

});

module.exports = router;
