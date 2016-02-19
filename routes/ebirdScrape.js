var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ebird = require('ebird');
ebird = new ebird();
var Firebase = require('Firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');


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

    ref.child('scraping').once('value').then(s => {
        if (s.val()) {
            throw 'Already scraping';
        }
    }).then(() => {
        return ref.child('scraping').set(true);
    }).then(() => {
        console.log('Scraping data for: ' + userId)
        return ref.once('value').then((s) => {
            userData = s.val();

            var handleData = (data) => {
                if (data) {
                    var totalsRef = firebaseRef.child('ebird/totals');
                    return new Promise((resolve, reject) => {
                        var ps = [];
                        data.forEach(row => {
                            var rowRef = totalsRef.child(userId).child(row.code);
                            row.items.forEach((item) => {
                                ps.push(rowRef.child(item.time).set(item.number));
                            });
                        });

                        Promise.all(ps).then(resolve).catch(reject);
                    });
                }
            };

            return ebird.auth(userData.ebird_username, userData.ebird_password).then(() => {
                return ebird.countries().then(handleData);
            }).then(() => {
                return ebird.states().then(handleData);
            }).then(() => {
                return ebird.counties().then(handleData);
            }).then(() => {
                return ebird.regions().then(handleData);
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
