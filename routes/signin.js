var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.post('/', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;


    if (true) {
        res.status(403);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            message: `Can't find that username and password`,
        }));
    } else {
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            userId: '',
        }));
    }
});

module.exports = router;
