var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var Keys = require('../utils/Keys');
var InviteEmail = require('../bin/react/email/InviteEmail');
var ReactDOMServer = require('react-dom/server');
var React = require('react');
var postmark = require('postmark');
var client = new postmark.Client(Keys.postmark);
var chalk = require('chalk');



router.use(bodyParser.json());
router.post('/', (req, res) => {
    var challengeId = req.body.challengeId;
    if (!challengeId) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'No challenge id',
        }));
        return;
    }

    var challengeRef = firebaseRef.child('challenges').child(challengeId);

    challengeRef.authWithCustomToken(Keys.firebase).then(() => {
        return challengeRef.once('value');
    }).then(sub => {
        var ps = [];
        var challenge = sub.val();
        var invites = challenge.invites;
        for (var key in invites) {
            if (invites[key].sent) {
                continue;
            }

            var email = invites[key].email;
            var inviterId = invites[key].inviter;

            ps.push(firebaseRef.child('users').child(inviterId).once('value').then(inviterSub => {
                return new Promise((resolve, reject) => {
                    var inviter = inviterSub.val();

                    var name = inviter.fullname || 'A Friend';

                    client.sendEmail({
                        From: 'info@birdervsbirder.com',
                        To: email,
                        Subject: `${name} has invited to a Birder Vs Birder challenge`,
                        HtmlBody: ReactDOMServer.renderToStaticMarkup(React.createElement(InviteEmail, {
                            challenge: challenge,
                            challengeId: challengeId,
                            email: email,
                            inviter: inviter,
                        })),
                    }, (error, success) => {
                        if (error) {
                            console.error(chalk.red('Error'), 'Unable to send via postmark: ' + error.message);
                            resolve();
                        } else {
                            console.info('Sent to postmark for delivery');
                            challengeRef.child('invites').child(key).child('sent').set(true).then(resolve);
                        }
                    });
                });
            }));
        }

        return Promise.all(ps);
    }).then(() => {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send();
    }).catch((e) => {
        console.error(chalk.red('Error'), e);
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'Sorry, we could not sent invites to this challenge.  Please try again later',
        }));
    });
});

module.exports = router;
