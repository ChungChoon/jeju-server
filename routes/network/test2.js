var exec = require("child_process").exec;



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