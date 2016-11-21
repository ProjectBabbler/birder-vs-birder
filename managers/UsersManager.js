var UserManager = require('./UserManager');
var emailUser = require('../routes/emailUser');
var chalk = require('chalk');
var deferred = require('deferred');

var firebase = require('../firebaseNode');
var firebaseRef = firebase.database();

emailUser = deferred.gate(emailUser, 1);

var getUsers = () => {
    var ref = firebaseRef.ref('users');
    return ref.once('value').then((s) => {
        var ps = [];
        s.forEach(cs => {
            var userData = cs.val();
            var userKey = cs.key;
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
        var ref = firebaseRef.ref('users');
        return ref.once('value').then((s) => {
            var ps = [];
            s.forEach(cs => {
                var key = cs.key;
                ps.push(new Promise((resolve, reject) => {
                    UserManager.fetchTotals(key)
                        .catch((e) => {
                            // Log the error, but don't block all updates.
                            console.error(chalk.red('Error'), e);
                        })
                        .then(resolve);
                }));
            });

            return Promise.all(ps);
        });
    },

    emailWeekly: () => {
        var ref = firebaseRef.ref('users');
        return ref.once('value').then((s) => {
            var ps = [];
            s.forEach(cs => {
                var userData = cs.val();
                var userKey = cs.key;
                ps.push(emailUser(userKey, userData.email).catch(e => {
                    // Log the error, but don't block all updates.
                    console.error(chalk.red('Error'), userKey, userData.email, e);
                }));
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
