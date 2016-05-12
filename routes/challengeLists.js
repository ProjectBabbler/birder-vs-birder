var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ChallengeUtils = require('../bin/react/utils/ChallengeUtils');
var userListsUtils = require('../bin/react/utils/userListsUtils');
var chalk = require('chalk');


router.use(bodyParser.json());
router.post('/', (req, res) => {
    var challengeId = req.body.challengeId;
    if (!challengeId) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'No challenge id',
        }));
        return;
    }

    ChallengeUtils.getMetaData(challengeId).then(metaData => {
        return ChallengeUtils.getUsers(challengeId).then((users) => {
            return userListsUtils.getLists(users, metaData.code, metaData.time);
        });
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
