var postmark = require("postmark");
var Keys = require('../src/Keys');
var client = new postmark.Client(Keys.postmark);
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var moment = require('moment');

module.exports = (uid, email) => {
    var lastWeek = moment().day(-7);

    return new Promise((resolve, reject) => {
        var subsRef = firebaseRef.child('ebird/subscriptions').child(uid);
        subsRef.once('value').then((snap) => {
            var recentMap = {};
            var ps = [];
            snap.forEach(childSnap => {
                ps.push(new Promise((resolve, reject) => {
                    var code = childSnap.key();
                    var name = childSnap.val().name;
                    var time = childSnap.val().time;
                    // TODO handle year

                    var listRef = firebaseRef.child('ebird/lists').child(uid).child(code).child(time);
                    listRef.once('value').then((listSnap) => {
                        var recent = [];
                        listSnap.forEach(lineSnap => {
                            var line = lineSnap.val();
                            var date = new Date(line.date);
                            if (moment(date).isAfter(lastWeek)) {
                                recent.push(line);
                            }
                        });

                        recentMap[code] = recent;
                        resolve(recent);
                    });
                }));
            });

            Promise.all(ps).then(() => {
                var message = '';
                for (var list in recentMap) {
                    var species = recentMap[list].map(r => {
                        return r.species;
                    });

                    message += `
                        Nice job on your ${list} list. You've seen all these species in since ${lastWeek.format('MMMM Do')}
                        ${species.join('\n')}
                    `
                }

                client.sendEmail({
                    From: 'info@fieldguideguru.com',
                    To: email,
                    Subject: 'Weekly Birder Vs Birder Update',
                    TextBody: message,
                }, (error, success) => {
                    if(error) {
                        console.error('Unable to send via postmark: ' + error.message);
                    } else {
                        console.info('Sent to postmark for delivery');
                    }
                    resolve();
                });
            });
        });
    });
};