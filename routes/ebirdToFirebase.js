'use strict';

var ebird = require('ebird');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(60 / 3, 'minute');
var Keys = require('../src/Keys');
var Cryptr = require('cryptr'),
cryptr = new Cryptr(Keys.cryptr);

class ebirdToFirebase {
    constructor(uid) {
        this.ebird = new ebird();
        this.uid = uid;
    }

    auth() {
        var ref = firebaseRef.child('users').child(this.uid);
        return ref.authWithCustomToken(Keys.firebase).then(() => {
            return ref.once('value');
        }).then((s) => {
            var userData = s.val();
            var password = cryptr.decrypt(userData.ebird_password);
            return this.ebird.auth(userData.ebird_username, password);
        });
    }

    totals() {
        var handleData = (list, data) => {
            if (data) {
                var totalsRef = firebaseRef.child('ebird/totals');
                return new Promise((resolve, reject) => {
                    var ps = [];
                    data.forEach(row => {
                        var rowRef = totalsRef.child(this.uid).child(list).child(row.code);
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
            ]).then(resolve).catch(reject);
        });
    }

    lists() {
        var subsRef = firebaseRef.child('ebird/subscriptions').child(this.uid);
        return subsRef.once('value').then((s) => {
            var subs = s.val();
            var handleListData = (code, timeFrame, year, data) => {
                if (data) {
                    var listsRef = firebaseRef.child('ebird/lists');
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