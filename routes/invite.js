var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var Keys = require('../src/Keys');
var InviteEmail = require('../bin/email/InviteEmail');
var ReactDOMServer = require('react-dom/server');
var React = require('react');
var postmark = require('postmark');
var client = new postmark.Client(Keys.postmark);



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
            ps.push(firebaseRef.child('users').orderByChild('email').equalTo(email).once('value').then(userSub => {
                return new Promise((resolve, reject) => {
                    var user = userSub.val();

                    client.sendEmail({
                        From: 'info@birdervsbirder.com',
                        To: email,
                        Subject: "You've been invited to a birder vs birder challenge",
                        HtmlBody: ReactDOMServer.renderToStaticMarkup(React.createElement(InviteEmail, {
                            challenge: challenge,
                            challengeId: challengeId,
                            user: user,
                            email: email,
                        })),
                    }, (error, success) => {
                        if (error) {
                            console.error('Unable to send via postmark: ' + error.message);
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
        console.error(e);
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: e,
        }));
    });
});

module.exports = router;
