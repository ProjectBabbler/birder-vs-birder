var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var TargetUtils = require('../bin/react/utils/TargetUtils');
var chalk = require('chalk');


router.use(bodyParser.json());
router.post('/', (req, res) => {
    let users = req.body.users.split(',');
    let { location, time, area, startMonth, endMonth } = req.body;

    TargetUtils.getTargets(users, location, time, area, startMonth, endMonth).then((results) => {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results));
    }).catch((e) => {
        console.error(chalk.red('Error'), e);
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: e,
        }));
    });
});

module.exports = router;
