var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var Keys = require('../utils/Keys');
var moment = require('moment');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);


var CleanUpManager = {
    cleanUpOldData: () => {
        var ref = firebaseRef;
        return ref.authWithCustomToken(Keys.firebase).then(() => {
            return ref.child('challenges').once('value');
        }).then((s) => {
            var ps = [];
            s.forEach(ch => {
                var challenge = ch.val();
                var snapshots = challenge.snapshots;
                var weekOld = moment.utc().startOf('day').subtract(7, 'days').valueOf();
                for (var time in snapshots) {
                    if (time < weekOld) {
                        ps.push(ref.child('challenges').child(ch.key()).child('snapshots').child(time).set(null));
                    }
                }
            });

            return Promise.all(ps).then(() => {
                console.log('Old Challenge Snapshots Removed');
            });
        }).then(() => {
            return ref.child('ebird/totals').once('value');
        }).then((s) => {
            var ps = [];
            s.forEach(totals => {
                var dates = totals.val();
                var twoWeeksOld = moment.utc().startOf('day').subtract(14, 'days').valueOf();
                for (var date in dates) {
                    if (date < twoWeeksOld) {
                        ps.push(ref.child('ebird/totals').child(totals.key()).child(date).set(null));
                    }
                }
            });

            return Promise.all(ps).then(() => {
                console.log('Old User Totals Removed');
            });
        }).then(() => {
            return ref.child('users').once('value');
        }).then((s) => {
            var ps = [];
            s.forEach(user => {
                var userData = user.val();
                if (userData.email.indexOf('projectbabbler+test+') == 0) {
                    ps.push(ref.removeUser({
                        email: userData.email,
                        password: 'babblebabble',
                    }));
                    ps.push(ref.child('users').child(user.key()).set(null));
                    ps.push(ref.child('ebird/totals').child(user.key()).set(null));
                    var password = cryptr.decrypt(userData.ebird_password);
                    ps.push(ref.removeUser({
                        email: userData.email,
                        password: password,
                    }));
                }
            });

            return Promise.all(ps).then(() => {
                console.log('Test Users Removed');
            });
        });
    },
};

module.exports = CleanUpManager;