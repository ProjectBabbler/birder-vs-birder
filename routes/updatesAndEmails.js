var ebirdToFirebase = require('./ebirdToFirebase');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var emailUser = require('./emailUser');
var Keys = require('../src/Keys');


var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(60 / 3, 'minute');

var ref = firebaseRef.child('users');
ref.authWithCustomToken(Keys.firebase).then(() => {
    return ref.once('value');
}).then((s) => {
    // Update totals.
    var ps = [];
    s.forEach(cs => {
        var key = cs.key();
        ps.push(new Promise((resolve, reject) => {
            limiter.removeTokens(1, () => {
                var ebird = new ebirdToFirebase(key);
                ebird.auth().then(() => {
                    console.log(`Moving totals for ${key}`);
                    return firebaseRef.child('ebird/totals').child(key).once('value');
                }).then((sub) => {
                    return firebaseRef.child('ebird/totals/last').child(key).set(sub.val());
                }).then(() => {
                    console.log(`Updating totals for ${key}`);
                    return ebird.totals();
                })
                .then(resolve)
                .catch((e) => {
                    // Log the error, but don't block all updates.
                    console.log(e);
                })
                .then(resolve);
            });
        }));
    });

    return Promise.all(ps);
}).then(() => {
    return ref.once('value');
}).then((s) => {
    // Update totals.
    var ps = [];
    s.forEach(cs => {
        var userData = cs.val();
        var userKey = cs.key();
        console.log(`Gathering and emailing for ${userKey}`);
        ps.push(emailUser(userKey, userData.email));
    });

    return Promise.all(ps);
}).then(() => {
    process.exit(0);
}).catch(e => {
    console.log(e);
    process.exit(1);
});