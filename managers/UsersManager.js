var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var Keys = require('../utils/Keys');
var UserManager = require('./UserManager');
var emailUser = require('../routes/emailUser');

var getUsers = () => {
    var ref = firebaseRef.child('users');
    return ref.authWithCustomToken(Keys.firebase).then(() => {
        return ref.once('value');
    }).then((s) => {
        var ps = [];
        s.forEach(cs => {
            var userData = cs.val();
            var userKey = cs.key();
            ps.push({
                key: userKey,
                data: userData,
            });
        });

        return ps;
    });
};

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
                    UserManager.fetchTotals(key)
                        .then(resolve)
                        .catch((e) => {
                            // Log the error, but don't block all updates.
                            console.error(e);
                        })
                        .then(resolve);
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

    takeShareScreenShots: () => {
        return getUsers().then(users => {
            var ps = users.map(user => {
                return UserManager.takeShareScreenShot(user.key, user.data);
            });

            return Promise.all(ps);
        });
    },

    updateCache: () => {
        return getUsers().then(users => {
            var ps = users.map(user => {
                return UserManager.updateCache(user);
            });

            return Promise.all(ps);
        });
    },
};

module.exports = UsersManager;
