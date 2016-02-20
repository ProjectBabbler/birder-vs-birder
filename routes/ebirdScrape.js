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
    if (!userId) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'No userId',
        }));
        return;
    }
    var ref = firebaseRef.child('users').child(userId);
    ref.auth(Keys.firebase).then(() => {
        return ref.child('scraping').once('value').then(s => {
            if (s.val()) {
                throw 'Already scraping';
            }
        });
    }).then(() => {
        return ref.child('scraping').set(true);
    }).then(() => {
        console.log('Scraping data for: ' + userId)
        return ref.once('value').then((s) => {
            userData = s.val();

            var handleData = (list, data) => {
                if (data) {
                    var totalsRef = firebaseRef.child('ebird/totals');
                    return new Promise((resolve, reject) => {
                        var ps = [];
                        data.forEach(row => {
                            var rowRef = totalsRef.child(userId).child(list).child(row.code);
                            ps.push(rowRef.child('name').set(row.name));
                            row.items.forEach((item) => {
                                ps.push(rowRef.child(item.time).set(item.number));
                            });
                        });

                        Promise.all(ps).then(resolve).catch(reject);
                    });
                }
            };
            var password = cryptr.decrypt(userData.ebird_password);
            return ebird.auth(userData.ebird_username, password).then(() => {
                return ebird.countries().then(handleData.bind(this, 'country'));
            }).then(() => {
                return ebird.states().then(handleData.bind(this, 'state'));
            }).then(() => {
                return ebird.counties().then(handleData.bind(this, 'county'));
            }).then(() => {
                return ebird.regions().then(handleData.bind(this, 'region'));
            }).then(() => {
                console.log('Finished scraping data for: ' + userId);
                res.status(200);
                res.send();
            });
        });
    }).catch((err) => {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: err || `Sorry something went wrong`,
        }));
    }).then(() => {
        return ref.child('scraping').set(false);
    });
});

module.exports = router;
