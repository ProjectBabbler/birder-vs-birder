var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ebirdToFirebase = require('./ebirdToFirebase');
var firebase = require('../firebaseNode');
var firebaseRef = firebase.database();



router.use(bodyParser.json());
router.post('/', (req, res) => {
    var userId = req.body.userId;
    if (!userId) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'No userId',
        }));
        return;
    }

    var eToF = new ebirdToFirebase(userId);
    var userRef = firebaseRef.ref('users').child(userId);

    userRef.child('scraping').once('value').then(s => {
        if (s.val()) {
            throw 'Already scraping';
        }
    }).then(() => {
        return userRef.child('scraping').set(true);
    }).then(() => {
        return eToF.auth();
    }).then(() => {
        console.log(`Scraping data for: ${userId}`);
        return eToF.totals();
    }).then(() => {
        console.log(`Finished data for: ${userId}`);
        res.status(200);
        res.send();
    }).catch((err) => {
        console.log(`Failed data for: ${userId}`);
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: err || 'Sorry something went wrong',
        }));
    }).then(() => {
        return userRef.child('scraping').set(false);
    });
});

module.exports = router;
