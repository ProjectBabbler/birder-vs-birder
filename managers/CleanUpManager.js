var Keys = require('../utils/Keys');
var moment = require('moment');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);
var deferred = require('deferred');

var firebase = require('../firebaseNode');
var firebaseRef = firebase.database();


var removeUser = (userSnapshot) => {
    var ps = [];
    var userData = userSnapshot.val();
    if (userData.email.indexOf('projectbabbler+test+') == 0) {
        ps.push(firebaseRef.ref('users').child(userSnapshot.key).set(null));
        ps.push(firebaseRef.ref('ebird/totals').child(userSnapshot.key).set(null));
        var password = cryptr.decrypt(userData.ebird_password);
        ps.push(firebase.auth().signInWithEmailAndPassword(userData.email, password).then(user => {
            return user.delete();
        }));
    }

    return Promise.all(ps);
};
removeUser = deferred.gate(removeUser, 5);

var CleanUpManager = {
    cleanUpOldData: () => {
        return firebaseRef.ref('challenges').once('value').then((s) => {
            var ps = [];
            s.forEach(ch => {
                var challenge = ch.val();
                var snapshots = challenge.snapshots;
                var weekOld = moment.utc().startOf('day').subtract(7, 'days').valueOf();
                for (var time in snapshots) {
                    if (time < weekOld) {
                        ps.push(firebaseRef.ref('challenges').child(ch.key).child('snapshots').child(time).set(null));
                    }
                }
            });

            return Promise.all(ps).then(() => {
                console.log('Old Challenge Snapshots Removed');
            });
        }).then(() => {
            return firebaseRef.ref('ebird/totals').once('value');
        }).then((s) => {
            var ps = [];
            s.forEach(totals => {
                var dates = totals.val();
                var twoWeeksOld = moment.utc().startOf('day').subtract(14, 'days').valueOf();
                for (var date in dates) {
                    if (date < twoWeeksOld) {
                        ps.push(firebaseRef.ref('ebird/totals').child(totals.key).child(date).set(null));
                    }
                }
            });

            return Promise.all(ps).then(() => {
                console.log('Old User Totals Removed');
            });
        }).then(() => {
            return firebaseRef.child('users').once('value');
        }).then((s) => {
            var ps = [];
            s.forEach(user => {
                ps.push(removeUser(user));
            });

            return Promise.all(ps).then(() => {
                console.log('Test Users Removed');
            });
        });
    },
};

module.exports = CleanUpManager;
