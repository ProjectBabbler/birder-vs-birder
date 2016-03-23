var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var Keys = require('../src/Keys');
var UserManager = require('./UserManager');
var emailUser = require('../routes/emailUser');

var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(10, 'minute');

var UsersManager = {
    updateTotals: () => {
        var ref = firebaseRef.child('users');
        return ref.authWithCustomToken(Keys.firebase).then(() => {
            return ref.once('value');
        }).then((s) => {
            var ps = [];
            s.forEach(cs => {
                var key = cs.key();
                ps.push(new Promise((resolve, reject) => {
                    limiter.removeTokens(1, () => {
                        UserManager.fetchTotals(key)
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
        });
    },

    emailWeekly: () => {
        var ref = firebaseRef.child('users');
        return ref.authWithCustomToken(Keys.firebase).then(() => {
            return ref.once('value');
        }).then((s) => {
            var ps = [];
            s.forEach(cs => {
                var userData = cs.val();
                var userKey = cs.key();
                console.log(`Gathering and emailing for ${userKey}`);
                ps.push(emailUser(userKey, userData.email));
            });

            return Promise.all(ps);
        });
    },
};

module.exports = UsersManager;