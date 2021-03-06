var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ebird = require('ebird');
ebird = new ebird();
var Keys = require('../utils/Keys');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);

router.use(bodyParser.json());
router.post('/', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    ebird
        .auth(username, password)
        .then(() => {
            // Don't sign up test account
            if (username == 'projectbabblertest2') {
                return true;
            }
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            var encryptedPassword = cryptr.encrypt(password);
            res.send(
                JSON.stringify({
                    encryptedPassword: encryptedPassword
                })
            );
        })
        .catch(e => {
            console.log(e);
            res.status(403);
            res.setHeader('Content-Type', 'application/json');
            res.send(
                JSON.stringify({
                    message:
                        "Sorry your ebird username or password wasn't correct"
                })
            );
        });
});

module.exports = router;
