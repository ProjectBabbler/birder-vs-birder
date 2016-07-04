var postmark = require('postmark');
var Keys = require('../utils/Keys');
var client = new postmark.Client(Keys.postmark);
var moment = require('moment');
var UpdateEmail = require('../bin/react/email/UpdateEmail');
var ReactDOMServer = require('react-dom/server');
var React = require('react');
var UserUtils = require('../bin/react/utils/UserUtils');
var chalk = require('chalk');
var userListsUtils = require('../bin/react/utils/userListsUtils');

var getLists = (uid, code, o, c) => {
    return Promise.all([
        userListsUtils.getListByUserId(uid, code, 'life'),
        userListsUtils.getListByUserId(uid, code, 'year'),
    ]).then(lists => {
        return {
            name: c.name,
            oldLife: o.life,
            newLife: c.life,
            lifeList: lists[0],
            oldYear: o.year,
            newYear: c.year,
            yearList: lists[1],
        };
    });
};

var getMessageForList = (uid, list) => {
    return Promise.all([
        UserUtils.getRecentTotalsRef(uid).then(ref => {
            return ref.orderByChild('type').equalTo(list).once('value');
        }),
        UserUtils.getLastWeekTotalsRef(uid).orderByChild('type').equalTo(list).once('value'),
    ]).then((results) => {
        var current = results[0].val();
        var old = results[1].val() || {};

        var rowPromises = [];
        for (var code in current) {
            var c = current[code];
            var o = old[code] || { life: 0, year: 0, };
            if (o.life != c.life || o.year != c.year) {
                rowPromises.push(getLists(uid, code, o, c));
            }
        }

        return Promise.all(rowPromises).then(rows => {
            return {
                list,
                lineItems: rows,
            };
        });
    });
};

module.exports = (uid, email) => {
    console.log(`Emailing for ${uid} ${email}`);
    return Promise.all([
        getMessageForList(uid, 'region'),
        getMessageForList(uid, 'country'),
        getMessageForList(uid, 'state'),
        getMessageForList(uid, 'county'),
    ]).then((results) => {
        return new Promise((resolve, reject) => {
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
        });
    });
};
