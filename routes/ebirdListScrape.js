var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var ebirdToFirebase = require('./ebirdToFirebase');


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
    console.log(`Scraping list data for: ${userId}`);
    eToF.auth().then(() => {
        return eToF.lists();
    }).then(() => {
        console.log(`Finished list data for: ${userId}`);
        res.status(200);
        res.send();
    }).catch((err) => {
        console.log(`Failed list data for: ${userId}`)
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: err || `Sorry something went wrong`,
        }));
    });
});

module.exports = router;
