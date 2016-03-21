var postmark = require('postmark');
var Keys = require('../src/Keys');
var client = new postmark.Client(Keys.postmark);
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var moment = require('moment');
var UpdateEmail = require('../bin/email/UpdateEmail');
var ReactDOMServer = require('react-dom/server');
var React = require('react');

var getMessageForList = (uid, list) => {
    return Promise.all([
        firebaseRef.child('ebird/totals').child(uid).orderByChild('type').equalTo(list).once('value'),
        firebaseRef.child('ebird/totals/last').child(uid).orderByChild('type').equalTo(list).once('value'),
    ]).then((results) => {
        var current = results[0].val();
        var old = results[1].val();

        var rows = [];
        for (var code in current) {
            var c = current[code];
            var o = old[code];
            if (o.life != c.life || o.year != c.year) {
                rows.push({
                    name: c.name,
                    oldLife: o.life,
                    newLife: c.life,
                    oldYear: o.year,
                    newYear: c.year,
                });
            }
        }

        return {
            list,
            lineItems: rows,
        };
    });
};

module.exports = (uid, email) => {
    return new Promise((resolve, reject) => {
        Promise.all([
            getMessageForList(uid, 'region'),
            getMessageForList(uid, 'country'),
            getMessageForList(uid, 'state'),
            getMessageForList(uid, 'county'),
        ]).then((results) => {
            client.sendEmail({
                From: 'info@birdervsbirder.com',
                To: email,
                Subject: `Weekly Birder Vs Birder Update for ${moment().format('MMMM Do YYYY')}`,
                HtmlBody: ReactDOMServer.renderToStaticMarkup(React.createElement(UpdateEmail, {
                    sections: results,
                })),
            }, (error, success) => {
                if (error) {
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