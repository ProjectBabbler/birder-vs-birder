'use strict';

var ebird = require('ebird');
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(60 / 3, 'minute');
var Keys = require('../utils/Keys');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);
var moment = require('moment');
var firebase = require('../firebaseNode');
var firebaseRef = firebase.database();

class ebirdToFirebase {
    constructor(uid) {
        this.ebird;
        this.uid = uid;
    }

    auth() {
        var ref = firebaseRef.ref('users').child(this.uid);
        return ref.once('value').then((s) => {
            var userData = s.val();

            this.ebird = new ebird();
            var password = cryptr.decrypt(userData.ebird_password);
            return this.ebird.auth(userData.ebird_username, password);
        });
    }

    totals() {
        var tempRef = firebaseRef.ref('temp/ebird/totals');
        var totalsRef = firebaseRef.ref('ebird/totals');
        tempRef   =   tempRef.child(this.uid).child(moment().utc().startOf('day').valueOf());
        totalsRef = totalsRef.child(this.uid).child(moment().utc().startOf('day').valueOf());
        var handleData = (list, data) => {
            if (data) {
                return new Promise((resolve, reject) => {
                    var ps = [];
                    data.forEach(row => {
                        var rowRef = tempRef.child(row.code);
                        ps.push(rowRef.child('type').set(list));
                        ps.push(rowRef.child('name').set(row.name));
                        row.items.forEach((item) => {
                            ps.push(rowRef.child(item.time).set(item.number));
                        });
                    });

                    Promise.all(ps).then(resolve).catch(reject);
                });
            }
        };

        return new Promise((resolve, reject) => {
            Promise.all([
                this.ebird.totals.countries().then(handleData.bind(this, 'country')),
                this.ebird.totals.states().then(handleData.bind(this, 'state')),
                this.ebird.totals.counties().then(handleData.bind(this, 'county')),
                this.ebird.totals.regions().then(handleData.bind(this, 'region')),
            ]).then((r) => {
                return tempRef.once('value').then((snapshot) => {
                    return totalsRef.set(snapshot.val());
                }).then(() => {
                    return tempRef.set(null);
                }).then(() => {
                    resolve(r);
                });
            }).catch((e) => {
                return tempRef.set(null).then(() => {
                    reject(e);
                });
            });
        });
    }

    lists() {
        var subsRef = firebaseRef.ref('ebird/subscriptions').child(this.uid);
        return subsRef.once('value').then((s) => {
            var subs = s.val();
            var handleListData = (code, timeFrame, year, data) => {
                if (data) {
                    var listsRef = firebaseRef.ref('ebird/lists');
                    return new Promise((resolve, reject) => {
                        var ps = [];
                        var rowRef = listsRef.child(this.uid).child(code).child(timeFrame);
                        if (year) {
                            rowRef = rowRef.child(year);
                        }
                        data.forEach((row, i) => {
                            ps.push(rowRef.child(i).set({
                                species: row.Species,
                                date: row.Date,
                            }));
                        });

                        Promise.all(ps).then(resolve).catch(reject);
                    });
                }
            };

            var getQueryFunc = (code, time) => {
                var year = time == 'year' ? new Date().getFullYear() : null;
                return new Promise((resolve, reject) => {
                    limiter.removeTokens(1, () => {
                        this.ebird.list(code, time)
                            .then(handleListData.bind(this, code, time, year))
                            .then(resolve)
                            .catch(reject);
                    });
                });
            };

            var promises = [];


            for (var code in subs) {
                var time = subs[code].time;
                var promiseSet = getQueryFunc(code, time);
                promises.push(promiseSet);
            }

            return Promise.all(promises);
        });
    }
}

module.exports = ebirdToFirebase;