var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Keys = require('../utils/Keys');
var stripe = require('stripe')(Keys.stripe);

router.use(bodyParser.json());
router.post('/', (req, res) => {
    var token = req.body.token;
    var amount = req.body.amount;

    if (!token) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'No token',
        }));
        return;
    }

    if (!amount) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: 'No amount',
        }));
        return;
    }

    stripe.charges.create({
        amount: amount,
        currency: 'usd',
        source: token,
        description: 'Donation to Birder Vs Birder',
    }, (err, charge) => {
        if (err) {
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                message: err,
            }));
        } else {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(charge));
        }
    });
});

module.exports = router;