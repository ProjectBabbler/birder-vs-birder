var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Keys = require('../src/Keys');
var ChallengeUtils = require('../utils/ChallengeUtils');
var ebird = require('ebird');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);
var ironcache = require('iron-cache');
var client = ironcache.createClient({ project: Keys.ironcacheProject, token: Keys.ironcacheToken });

var getCacheKey = (user, code, time) => {
    return `${user.data.ebird_username}${code}${time}`;
};


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
                var cacheKey = getCacheKey(user, metaData.code, metaData.time);

                return new Promise((resolve, reject) => {
                    client.get('birdLists', cacheKey, (err, res) => {
                        if (err) {
                            // Ok if cache fails.
                            resolve(null);
                        } else {
                            var result = JSON.parse(res.value);
                            resolve(result);
                        }
                    });
                }).then(result => {
                    if (result) {
                        return result;
                    }

                    var instance = new ebird();
                    var password = cryptr.decrypt(user.data.ebird_password);
                    return instance.auth(user.data.ebird_username, password).then(() => {
                        return instance.list(metaData.code, metaData.time).then(list => {
                            return new Promise((resolve, reject) => {
                                var data = {
                                    user: user,
                                    list: list,
                                };
                                var config = {
                                    value: JSON.stringify(data),
                                    expires_in: 60 * 60 * 4, // 4 hours
                                };
                                client.put('birdLists', cacheKey, config, (err, res) => {
                                    if (err) {
                                        console.log(err);
                                        // Ok if cache fails.
                                    }
                                    resolve(data);
                                });
                            });
                        });
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