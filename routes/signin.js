var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.post('/', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    res.status(200);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        userId: '',
    }));
});

module.exports = router;
