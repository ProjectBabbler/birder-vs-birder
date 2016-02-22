var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ebird = require('ebird');
ebird = new ebird();
var Firebase = require('Firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var Keys = require('../src/Keys');
var Cryptr = require('cryptr'),
cryptr = new Cryptr(Keys.cryptr);

router.use(bodyParser.json());
router.post('/', (req, res) => {
    var userId = req.body.userId;
    var code = req.body.code;
    if (!userId) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'No userId',
        }));
        return;
    }
    if (!code) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'No code',
        }));
        return;
    }

    var ref = firebaseRef.child('users').child(userId);
    ref.authWithCustomToken(Keys.firebase).then(() => {
        console.log(`Scraping list data for: ${userId} ${code}`);
        return ref.once('value').then((s) => {
            userData = s.val();

            var handleListData = (code, timeFrame, year, data) => {
                if (data) {
                    var listsRef = firebaseRef.child('ebird/lists');
                    return new Promise((resolve, reject) => {
                        var ps = [];
                        var rowRef = listsRef.child(userId).child(code).child(timeFrame);
                        if (year) {
                            rowRef = rowRef.child(year);
                        }
                        data.forEach(row => {
                            ps.push(new Promise((resolve, reject) => {
                                rowRef.push({
                                    species: row.Species,
                                    date: row.Date,
                                }, (err) => {
                                    if (err) {
                                        console.log(err)
                                        reject(err);
                                    } else {
                                        resolve();
                                    }
                                });
                            }))
                        });

                        Promise.all(ps).then(resolve).catch(reject);
                    });
                }
            };

            var password = cryptr.decrypt(userData.ebird_password);
            return ebird.auth(userData.ebird_username, password).then(() => {
                var year = new Date().getFullYear();
                return Promise.all([
                    ebird.list(code, 'life').then(handleListData.bind(this, code, 'life', null)),
                    ebird.list(code, 'life').then(handleListData.bind(this, code, 'year', year)),
                    ebird.list(code, 'life').then(handleListData.bind(this, code, 'month', null)),
                ]);
            }).then(() => {
                console.log(`Finished list data for: ${userId} ${code}`);
                res.status(200);
                res.send();
            });
        });
    }).catch((err) => {
        console.log(`Failed list data for: ${userId} ${code}`)
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: err || `Sorry something went wrong`,
        }));
    });
});

module.exports = router;
