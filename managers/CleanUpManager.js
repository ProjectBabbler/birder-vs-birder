var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var Keys = require('../src/Keys');
var moment = require('moment');


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
        });
    },
};

module.exports = CleanUpManager;