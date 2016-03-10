var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ebird = require('ebird');
ebird = new ebird();
var Keys = require('../src/Keys');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);

router.use(bodyParser.json());
router.post('/', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    ebird.auth(username, password).then(() => {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        var encryptedPassword = cryptr.encrypt(password);
        res.send(JSON.stringify({
            encryptedPassword: encryptedPassword,
        }));
    }).catch(() => {
        res.status(403);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: "Sorry your ebird username or password wasn't correct",
        }));
    });
});

module.exports = router;
