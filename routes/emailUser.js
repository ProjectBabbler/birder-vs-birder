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

            var current = results[0].val();
            var old = results[1].val();
            for (var heading in current) {
                var rows = [];
                for (var code in current[heading]) {
                    var c = current[heading][code];
                    var o = old[heading][code]
                    rows.push(`
                        <tr>
                            <td>${c.name}</td>
                            <td>${o.life} -> ${c.life}</td>
                            <td>${o.year} -> ${c.year}</td>
                        </tr>
                    `);
                }

                message += `
                    <br/>
                    ${heading}
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
            }

            client.sendEmail({
                From: 'info@fieldguideguru.com',
                To: email,
                Subject: 'Weekly Birder Vs Birder Update',
                HtmlBody: `
                    <html>
                        <body>
                            ${message}
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