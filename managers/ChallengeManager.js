'use strict';
var ChallengeUtils = require('../bin/react/utils/ChallengeUtils');
var moment = require('moment');
var emailChallenge = require('../routes/emailChallenge');
var userListsUtils = require('../bin/react/utils/userListsUtils');
var UserUtils = require('../bin/react/utils/UserUtils');
var deferred = require('deferred');
var chalk = require('chalk');

var firebase = require('../firebaseNode');
var firebaseRef = firebase.database();

var ChallengeManager = {
    updateSnapshot(cid) {
        console.log(`Getting snapshot for challenge ${cid}`);
        return ChallengeUtils.getSnapshot(cid).then(snapshot => {
            return firebaseRef
                .ref('challenges')
                .child(cid)
                .child('snapshots')
                .child(moment.utc().startOf('day').valueOf())
                .set(snapshot).then((r) => {
                    console.log(`Saved snapshot for challenge ${cid}`);
                    return r;
                });
        }).catch(e => {
            // Catch error but don't let it stop the process.
            console.error(chalk.red('Error ChallengeManager.updateSnapshot'), cid, e);
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
            console.error(chalk.red('Error'), e);
        });
    },

    emailChanges(challengeKey, challenge) {
        console.log(`Analyzing ${challengeKey} for challenge email`);
        var snapshots = challenge.snapshots;
        var keys = snapshots ? Object.keys(snapshots).sort() : [];
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

        changes = changes.map(change => {
            if (change.currentTotal == change.lastTotal) {
                return change;
            } else {
                return UserUtils.getUserData(change.userKey).then(data => {
                    return userListsUtils.getLists([{
                        data: data,
                    }], challenge.code, challenge.time);
                }).then(lists => {
                    change.list = lists[0].list;
                    return change;
                });
            }
        });

        return Promise.all(changes).then(changesWithLists => {
            return emailChallenge(challengeKey, challenge, changesWithLists, {
                rankChange,
                numbersChange,
            });
        }).then(() => {
            console.log(`Send change emails for ${challenge.name}`);
        }).catch(e => {
            // Catch error but don't let it stop the process.
            console.error(chalk.red('Error'), e);
        });
    },
};

for (var key in ChallengeManager) {
    ChallengeManager[key] = deferred.gate(ChallengeManager[key], 5);
}

module.exports = ChallengeManager;
