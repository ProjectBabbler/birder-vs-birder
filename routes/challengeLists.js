var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Keys = require('../src/Keys');
var ChallengeUtils = require('../src/ChallengeUtils');
var ebird = require('ebird');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);




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
            var ps = users.map(user => {
                var instance = new ebird();
                var password = cryptr.decrypt(user.data.ebird_password);
                return instance.auth(user.data.ebird_username, password).then(() => {
                    return instance.list(metaData.code, metaData.time).then(list => {
                        return {
                            user: user,
                            list: list,
                        };
                    });
                });
            });

            return Promise.all(ps);
        });
    }).then((results) => {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(results));
    }).catch((e) => {
        console.log(e);
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: e,
        }));
    });
});

module.exports = router;