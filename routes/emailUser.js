var postmark = require('postmark');
var Keys = require('../utils/Keys');
var client = new postmark.Client(Keys.postmark);
var moment = require('moment');
var UpdateEmail = require('../bin/react/email/UpdateEmail');
var ReactDOMServer = require('react-dom/server');
var React = require('react');
var UserUtils = require('../bin/react/utils/UserUtils');
var chalk = require('chalk');

var getMessageForList = (uid, list) => {
    return Promise.all([
        UserUtils.getRecentTotalsRef(uid).then(ref => {
            return ref.orderByChild('type').equalTo(list).once('value');
        }),
        UserUtils.getLastWeekTotalsRef(uid).orderByChild('type').equalTo(list).once('value'),
    ]).then((results) => {
        var current = results[0].val();
        var old = results[1].val() || {};

        var rows = [];
        for (var code in current) {
            var c = current[code];
            var o = old[code] || { life: 0, year: 0, };
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
                    console.error(chalk.red('Error'), 'Unable to send via postmark: ' + error.message);
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