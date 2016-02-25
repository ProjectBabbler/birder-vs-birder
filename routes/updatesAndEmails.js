var postmark = require("postmark");
var Keys = require('../src/Keys');
var client = new postmark.Client(Keys.postmark);
var ebirdToFirebase = require('./ebirdToFirebase');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');

var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(60 / 3, 'minute');

var ref = firebaseRef.child('users');
return ref.authWithCustomToken(Keys.firebase).then(() => {
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
                    return ebird.totals();
                })
                .then(resolve)
                .catch((e) => {
                    // Log the error, but don't block all updates.
                    console.log(e)
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
        ps.push(new Promise((resolve, reject) => {
            client.sendEmail({
                "From": "info@fieldguideguru.com",
                "To": userData.email,
                "Subject": "Weekly Birder Vs Birder Update",
                "TextBody": "Hello from Postmark!"
            }, (error, success) => {
                if(error) {
                    console.error("Unable to send via postmark: " + error.message);
                } else {
                    console.info("Sent to postmark for delivery");
                }
                resolve();
            });
        }));
    });

    return Promise.all(ps);
}).then(() => {
    process.exit(0);
});