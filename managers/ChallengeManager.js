var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ChallengeUtils = require('../utils/ChallengeUtils');
var moment = require('moment');

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
    }
};

module.exports = ChallengeManager;