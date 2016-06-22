var ChallengeManager = require('./ChallengeManager');

var firebase = require('../firebaseNode');
var firebaseRef = firebase.database();

var ChallengesManager = {
    updateSnapshots: () => {
        var ref = firebaseRef.ref('challenges');
        return ref.once('value').then((s) => {
            var ps = [];
            s.forEach(cs => {
                var key = cs.key;
                ps.push(ChallengeManager.updateSnapshot(key));
            });

            return Promise.all(ps);
        });
    },

    updateCache: () => {
        var ref = firebaseRef.ref('challenges');
        return ref.once('value').then((s) => {
            var ps = [];
            s.forEach(cs => {
                var key = cs.key;
                ps.push(ChallengeManager.updateCache(key));
            });

            return Promise.all(ps);
        });
    },


    emailChanges: () => {
        var ref = firebaseRef.ref('challenges');
        return ref.once('value').then((s) => {
            var ps = [];
            s.forEach(cs => {
                ps.push(ChallengeManager.emailChanges(cs.key, cs.val()));
            });

            return Promise.all(ps);
        });
    },
};

module.exports = ChallengesManager;
