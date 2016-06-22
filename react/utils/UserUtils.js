var moment = require('moment');
var firebase = require('../firebase');
var firebaseRef = firebase.database();

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
        var userRef = firebaseRef.ref('ebird/totals').child(uid);
        return userRef.orderByKey().limitToLast(1).once('value').then(snap => {
            return userRef.child(getKey(snap.val()));
        });
    },

    getYesterdayTotalsRef(uid) {
        return firebaseRef
            .ref('ebird/totals')
            .child(uid)
            .child(moment.utc().startOf('day').subtract(1, 'days').valueOf());
    },

    getLastWeekTotalsRef(uid) {
        return firebaseRef
            .ref('ebird/totals')
            .child(uid)
            .child(moment.utc().startOf('day').subtract(7, 'days').valueOf());
    },

    getUserData(uid) {
        return firebaseRef
            .ref('users')
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
            .ref('users')
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
            .ref('users')
            .child(uid)
            .child('shareImage')
            .set(data);
    },

    getFBShareImage(uid) {
        return firebaseRef
            .ref('users')
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