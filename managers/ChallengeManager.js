'use strict';

var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ChallengeUtils = require('../bin/react/utils/ChallengeUtils');
var moment = require('moment');
var emailChallenge = require('../routes/emailChallenge');
var userListsUtils = require('../bin/react/utils/userListsUtils');

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
        }).catch(e => {
            // Catch error but don't let it stop the process.
            console.error(e);
        });
    },

    updateCache(cid) {
        console.log(`Updating caches for all users of challenge ${cid}`);
        return ChallengeUtils.getMetaData(cid).then(metaData => {
            return ChallengeUtils.getUsers(cid).then((users) => {
                return userListsUtils.getLists(users, metaData.code, metaData.time, {force: true});
            });
        }).catch(e => {
            // Catch error but don't let it stop the process.
            console.error(e);
        });
    },

    emailChanges(challengeKey, challenge) {
        console.log(`Analyzing ${challengeKey} for challenge email`);
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

        var rankChange = false;
        var numbersChange = false;
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
                rankChange = true;
            }

            if (data.lastTotal != data.currentTotal) {
                numbersChange = true;
            }
        }

        if (!rankChange && !numbersChange) {
            // No changes, so no email to send.
            return;
        }

        console.log(`${challengeKey} had changes`);

        return emailChallenge(challengeKey, challenge, changes, {
            rankChange,
            numbersChange,
        }).then(() => {
            console.log(`Send change emails for ${challenge.name}`);
        }).catch(e => {
            // Catch error but don't let it stop the process.
            console.error(e);
        });
    },
};

module.exports = ChallengeManager;
