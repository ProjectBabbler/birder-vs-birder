'use strict';

var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ChallengeUtils = require('../bin/react/utils/ChallengeUtils');
var moment = require('moment');
var emailChallenge = require('../routes/emailChallenge');

var ChallengeManager = {
    updateSnapshot(cid) {
        console.log(`Getting snapshot for challenge ${cid}`);
        return ChallengeUtils.getSnapshot(cid).then(snapshot => {
            return firebaseRef
                .child('challenges')
                .child(cid)
                .child('snapshots')
                .child(moment.utc().startOf('day').valueOf())
                .set(snapshot).then((r) => {
                    console.log(`Saved snapshot for challenge ${cid}`);
                    return r;
                });
        });
    },

    emailChanges(challengeKey, challenge) {
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

        var foundChange = false;
        var changes = [];
        for (let i = 0; i < currentSnap.length; i++) {
            let userKey = currentSnap[i].userKey;
            let index = indexOfUserKey(lastSnap, userKey);
            var data = {
                currentIndex: i,
                lastIndex: index,
                currentTotal: currentSnap[i].total,
                userKey: userKey,
                name: currentSnap[i].name,
            };

            if (index != -1) {
                data.lastTotal = lastSnap[index].total;
            }

            changes.push(data);

            if (index != i) {
                foundChange = true;
            }
        }

        if (!foundChange) {
            // No changes, so no email to send.
            return;
        }

        return emailChallenge(challengeKey, challenge, changes).then(() => {
            console.log(`Send change emails for ${challenge.name}`);
        });
    },
};

module.exports = ChallengeManager;