var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var Keys = require('../src/Keys');
var ChallengeManager = require('./ChallengeManager');


var UsersManager = {
    updateSnapshots: () => {
        var ref = firebaseRef.child('challenges');
        return ref.authWithCustomToken(Keys.firebase).then(() => {
            return ref.once('value');
        }).then((s) => {
            var ps = [];
            s.forEach(cs => {
                var key = cs.key();
                ps.push(ChallengeManager.updateSnapshot(key));
            });

            return Promise.all(ps);
        });
    },

    emailChanges: () => {
        var ref = firebaseRef.child('challenges');
        return ref.authWithCustomToken(Keys.firebase).then(() => {
            return ref.once('value');
        }).then((s) => {
            var ps = [];
            s.forEach(cs => {
                ps.push(ChallengeManager.emailChanges(cs.key(), cs.val()));
            });

            return Promise.all(ps);
        });
    },
};

module.exports = UsersManager;