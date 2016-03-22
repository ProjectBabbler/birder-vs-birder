var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var UserUtils = require('../utils/UserUtils');


var ChallengeUtils = {
    getSnapshot(id) {
        var challengeRef = firebaseRef.child('challenges').child(id);
        return challengeRef.child('members').once('value').then(snap => {
            var ps = [];
            snap.forEach(member => {
                ps.push(new Promise((resolve, reject) => {
                    Promise.all([
                        firebaseRef.child('users').child(member.key()).once('value'),
                        UserUtils.getRecentTotalsRef(member.key()).then(ref => {
                            return ref.child(this.props.challenge.code).once('value');
                        }),
                    ]).then(result => {
                        return {
                            user: result[0].val(),
                            userKey: result[0].key(),
                            total: result[1].val() || {},
                        };
                    }).then(resolve).catch(reject);
                }));
            });

            return Promise.all(ps).then(results => {
                var sorted = results.sort((a, b) => {
                    return b.total - a.total;
                });
                return sorted;
            });
        });
    },

    getMetaData(id) {
        return firebaseRef.child('challenges').child(id).once('value').then(snap => {
            return snap.val();
        });
    },

    getUsers(id) {
        var challengeRef = firebaseRef.child('challenges').child(id);
        return challengeRef.child('members').once('value').then(snap => {
            var ps = [];
            snap.forEach(member => {
                ps.push(new Promise((resolve, reject) => {
                    firebaseRef.child('users').child(member.key()).once('value').then(result => {
                        return {
                            data: result.val(),
                            key: result.key(),
                        };
                    }).then(resolve).catch(reject);
                }));
            });

            return Promise.all(ps);
        });
    }
};

module.exports = ChallengeUtils;