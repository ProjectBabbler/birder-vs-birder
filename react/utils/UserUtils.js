var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var moment = require('moment');

var getKey = (val) => {
    if (val == undefined) {
        throw 'No Keys';
    }
    for (var key in val) {
        return key;
    }
};

var UserUtils = {
    getRecentTotalsRef(uid) {
        var userRef = firebaseRef.child('ebird/totals').child(uid);
        return userRef.orderByKey().limitToLast(1).once('value').then(snap => {
            return userRef.child(getKey(snap.val()));
        });
    },

    getYesterdayTotalsRef(uid) {
        return firebaseRef
            .child('ebird/totals')
            .child(uid)
            .child(moment.utc().startOf('day').subtract(1, 'days').valueOf());
    },

    getLastWeekTotalsRef(uid) {
        return firebaseRef
            .child('ebird/totals')
            .child(uid)
            .child(moment.utc().startOf('day').subtract(7, 'days').valueOf());
    },

    getUserData(uid) {
        return firebaseRef
            .child('users')
            .child(uid)
            .once('value').then(snap => {
                if (snap) {
                    return snap.val();
                } else {
                    return null;
                }
            });
    },

    getUserByName(username) {
        return firebaseRef
            .child('users')
            .orderByChild('ebird_username')
            .equalTo(username)
            .once('value').then(snap => {
                if (snap) {
                    var data = snap.val();
                    for (var key in data) {
                        data[key]._key = key;
                        return data[key];
                    }
                } else {
                    return null;
                }
            });
    },

    saveFBShareImage(uid, data) {
        return firebaseRef
            .child('users')
            .child(uid)
            .child('shareImage')
            .set(data);
    },

    getFBShareImage(uid) {
        return firebaseRef
            .child('users')
            .child(uid)
            .child('shareImage')
            .once('value').then(snap => {
                if (snap) {
                    return snap.val();
                } else {
                    return null;
                }
            });
    },

    populateWithDefaults(data) {
        if (!data) {
            return data;
        }

        return {
            emailChallengeRankChange: true,
            emailChallengeChange: true,
            ...data,
        };
    }
};

module.exports = UserUtils;