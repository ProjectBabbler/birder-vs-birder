var postmark = require('postmark');
var Keys = require('../utils/Keys');
var client = new postmark.Client(Keys.postmark);
var ChallengeEmail = require('../bin/react/email/ChallengeEmail');
var ReactDOMServer = require('react-dom/server');
var React = require('react');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var moment = require('moment');
var UserUtils = require('../bin/react/utils/UserUtils');



module.exports = (challengeKey, challenge, changes, changeTypes) => {
    var ps = [];
    var subject = `Challenge Updates for ${challenge.name} on ${moment().format('MMMM Do YYYY')} - Birder Vs Birder`;

    for (var key in challenge.members) {
        ps.push(firebaseRef.child('users').child(key).once('value').then(snap => {
            var user = snap.val();
            user = UserUtils.populateWithDefaults(user);
            var email = user.email;

            var wantsRankChange = changeTypes.rankChange && user.emailChallengeRankChange;
            var wantsChange = changeTypes.numbersChange && user.emailChallengeChange;

            if (!wantsChange && !wantsRankChange) {
                return;
            }

            var htmlBody = ReactDOMServer.renderToStaticMarkup(React.createElement(ChallengeEmail, {
                changes: changes,
                challenge: challenge,
                challengeKey: challengeKey,
                userKey: snap.key(),
            }));
            return new Promise((resolve, reject) => {
                client.sendEmail({
                    From: 'info@birdervsbirder.com',
                    To: email,
                    Subject: subject,
                    HtmlBody: htmlBody,
                }, (error, success) => {
                    if (error) {
                        console.error('Unable to send via postmark: ' + error.message);
                    } else {
                        console.info('Sent to postmark for delivery');
                    }
                    resolve();
                });
            });
        }));
    }

    return Promise.all(ps);
};
