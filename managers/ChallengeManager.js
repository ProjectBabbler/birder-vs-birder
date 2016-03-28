var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ChallengeUtils = require('../utils/ChallengeUtils');
var moment = require('moment');
var ord = require('ord');

var ChallengeManager = {
    updateSnapshot(cid) {
        console.log(`Getting snapshot for challenge ${cid}`);
        return ChallengeUtils.getSnapshot(cid).then(snapshot => {
            return firebaseRef
                .child('challenges')
                .child(cid)
                .child('snapshots')
                .child(moment().startOf('day').valueOf())
                .set(snapshot).then((r) => {
                    console.log(`Saved snapshot for challenge ${cid}`);
                    return r;
                });
        });
    },

    emailChanges(challenge) {
        var snapshots = challenge.snapshots;
        var keys = Object.keys(snapshots).sort();
        if (keys.length < 2) {
            return;
        }

        var toArray = (snap) => {
            var results = [];
            Object.keys(snap).sort().forEach(key => {
                results.push(snap[key]);
            });
            return results;
        };

        var indexOfUserKey = (arr, key) => {
            for (var i = arr.length - 1; i >= 0; i--) {
                if (key == arr[i].userKey) {
                    return i;
                }
            }

            return -1;
        };

        var current = keys[keys.length - 1];
        var last = keys[keys.length - 2];
        var currentSnap = toArray(snapshots[current]);
        var lastSnap = toArray(snapshots[last]);

        var ps = [];

        for (var i = lastSnap.length - 1; i >= 0; i--) {
            var userKey = lastSnap[i].userKey;
            var index = indexOfUserKey(currentSnap, userKey);
            if (index > i) {
                ps.push(firebaseRef.child('users').child(userKey).once('value').then(snap => {
                    var name = snap.val().fullname;
                    return `${name} moved into ${index}${ord(index)}`;
                }));
            }
        }

        return Promise.all(ps).then(message => {
            console.log(message);
        });
    },
};

module.exports = ChallengeManager;