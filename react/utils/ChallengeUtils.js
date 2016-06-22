var UserUtils = require('./UserUtils');
var firebase = require('../firebase');
var firebaseRef = firebase.database();


var ChallengeUtils = {
    getSnapshot(id) {
        return firebaseRef.ref('challenges').child(id).once('value').then(snap => {
            var challenge = snap.val();
            var ps = [];
            for (var memberId in challenge.members) {
                ps.push(new Promise((resolve, reject) => {
                    Promise.all([
                        firebaseRef.ref('users').child(memberId).once('value'),
                        UserUtils.getRecentTotalsRef(memberId).then(ref => {
                            return ref.child(challenge.code).once('value');
                        }),
                    ]).then(result => {
                        var total = result[1].val() || {};
                        return {
                            userKey: result[0].key,
                            name: result[0].val().fullname,
                            total: total[challenge.time] || 0,
                        };
                    }).then(resolve).catch(reject);
                }));
            }

            return Promise.all(ps).then(results => {
                var sorted = results.sort((a, b) => {
                    return b.total - a.total;
                });
                return sorted;
            });
        });
    },

    getMetaData(id) {
        return firebaseRef.ref('challenges').child(id).once('value').then(snap => {
            return snap.val();
        });
    },

    getUsers(id) {
        var challengeRef = firebaseRef.ref('challenges').child(id);
        return challengeRef.child('members').once('value').then(snap => {
            var ps = [];
            snap.forEach(member => {
                ps.push(new Promise((resolve, reject) => {
                    firebaseRef.ref('users').child(member.key).once('value').then(result => {
                        return {
                            data: result.val(),
                            key: result.key,
                        };
                    }).then(resolve).catch(reject);
                }));
            });

            return Promise.all(ps);
        });
    },
};

module.exports = ChallengeUtils;