var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var Keys = require('../src/Keys');
var UserManager = require('./UserManager');

var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(10, 'minute');

var UsersManager = {
    updateTotals: () => {
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
    }
};

module.exports = UsersManager;