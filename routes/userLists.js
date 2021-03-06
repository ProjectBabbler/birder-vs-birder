var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var userListsUtils = require('../bin/react/utils/userListsUtils');
var UserUtils = require('../bin/react/utils/UserUtils');
var chalk = require('chalk');


router.use(bodyParser.json());
router.post('/', (req, res) => {
    var username = req.body.username;
    if (!username) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'No user name',
        }));
        return;
    }

    UserUtils.getUserByName(username).then(data => {
        return userListsUtils.getLists([{
            data: data,
        }], 'WORLD', 'life');
    }).then((results) => {
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
