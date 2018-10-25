const express = require('express'),
    router = express.Router();

// const {
//     spawn
// } = require('child_process');
// const ls = spawn('cd', ['./bc_network']);

// ls.stdout.on('data', (data) => {
//     console.log(`stdout: ${data}`);
// });

// ls.stderr.on('data', (data) => {
//     console.log(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//     console.log(`child process exited with code ${code}`);
// });


var exec = require("child_process").exec;



router.get('/', function (req, res, next) {
    let cmd = `cd ./bc_network; sh init.sh; sh start.sh; ./klay attach http://localhost:8551;`;
    console.log(cmd);

    exec(cmd, function (err, stdout, stderr) {

        //Print stdout/stderr to console

        console.log(stdout);

        console.log(stderr);

        //Simple response to user whenever localhost:3003 is accessed

        // res.render('cmd', {
        //     title: 'Express',
        //     data: stdout
        // });
        console.log(err);

    });

});

router.get('/start', function (req, res, next) {
    let cmd = `pwd`;
    console.log(cmd);

    exec(cmd, function (err, stdout, stderr) {
        // console.log(stdout);
        // cmd = `sh init.sh`;
        // exec(cmd, function (err, stdout, stderr) {
        //     console.log(stdout);
        // });

        //Print stdout/stderr to console

        console.log(stdout);

        console.log(stderr);

        //Simple response to user whenever localhost:3003 is accessed

        // res.render('cmd', {
        //     title: 'Express',
        //     data: stdout
        // });
        console.log(err);

    });

});

module.exports = router;