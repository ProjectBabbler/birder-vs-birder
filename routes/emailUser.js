var postmark = require("postmark");
var Keys = require('../src/Keys');
var client = new postmark.Client(Keys.postmark);
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var moment = require('moment');

module.exports = (uid, email) => {
    return new Promise((resolve, reject) => {
        var recentMap = {};
        Promise.all([
            firebaseRef.child('ebird/totals').child(uid).once('value'),
            firebaseRef.child('ebird/totals/last').child(uid).once('value'),
        ]).then((results) => {
            var message = '';
            var hasUpdates = false;

            var current = results[0].val();
            var old = results[1].val();
            for (var heading in current) {
                var rows = [];
                for (var code in current[heading]) {
                    var c = current[heading][code];
                    var o = old[heading][code]
                    if (o.life != c.life || o.year != c.year) {
                        rows.push(`
                            <tr>
                                <td>${c.name}</td>
                                <td>${o.life} -> ${c.life}</td>
                                <td>${o.year} -> ${c.year}</td>
                            </tr>
                        `);
                    }
                }

                if (rows.length) {
                    hasUpdates = true;
                    message += `
                        <br/>
                        Nice job on your ${heading} lists.  Here are all the places you got new birds.
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Life Total</th>
                                    <th>Year Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows.join('')}
                            </tbody>
                        </table>
                    `;
                } else {
                    message += `
                        <br/>
                        Sorry no updates for ${heading} this week.  Good luck birding.
                    `;
                }
            }

            var fullMessage;
            if (hasUpdates) {
                fullMessage = `
                    <h1>Nice job birding this week.  Here are all your updates</h1>
                    ${message}
                `;
            } else {
                fullMessage = `
                    <h1>No new birds this week.  Good luck birding.</h1>
                `;
            }

            client.sendEmail({
                From: 'info@fieldguideguru.com',
                To: email,
                Subject: 'Weekly Birder Vs Birder Update',
                HtmlBody: `
                    <html>
                        <body>
                            ${fullMessage}
                        </body>
                    </html>
                `,
            }, (error, success) => {
                if(error) {
                    console.error('Unable to send via postmark: ' + error.message);
                } else {
                    console.info('Sent to postmark for delivery');
                }
                resolve();
            });
        }).catch(e => {
            reject(e);
        });
    });
};