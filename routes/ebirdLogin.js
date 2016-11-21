var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ebird = require('ebird');
ebird = new ebird();
var Keys = require('../utils/Keys');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);
var mailchimp = require('mailchimp-v3');
mailchimp.setApiKey(Keys.mailchimp);
var MailchimpLists = require('./MailchimpLists');
var humanname = require('humanname');


router.use(bodyParser.json());
router.post('/', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    ebird.auth(username, password).then(() => {
        // Don't sign up test account
        if (username == 'projectbabblertest2') {
            return true;
        }
        var parsed = humanname.parse(req.body.fullname);
        return mailchimp.post(`lists/${MailchimpLists.all}/members`, {
            email_address: req.body.email,
            status: 'subscribed',
            merge_fields: {
                FNAME: parsed.firstName,
                LNAME: parsed.lastName,
            }
        });
    }).then(() => {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        var encryptedPassword = cryptr.encrypt(password);
        res.send(JSON.stringify({
            encryptedPassword: encryptedPassword,
        }));
    }).catch((e) => {
        console.log(e);
        res.status(403);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: "Sorry your ebird username or password wasn't correct",
        }));
    });
});

module.exports = router;
