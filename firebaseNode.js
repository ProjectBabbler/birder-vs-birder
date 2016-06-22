var Keys = require('./utils/Keys');
var firebase = require('firebase');
var config = {
    apiKey: 'AIzaSyAgN21NhwJt6MMLxanxxsgHR712fB6QjSE',
    authDomain: 'blazing-inferno-9225.firebaseapp.com',
    databaseURL: 'https://blazing-inferno-9225.firebaseio.com',
    serviceAccount: {
        project_id: 'blazing-inferno-9225',
        private_key: Keys.firebaseServiceKey,
        client_email: 'birder-vs-birder-server@blazing-inferno-9225.iam.gserviceaccount.com',
    }
};
let firebaseApp = firebase.initializeApp(config, 'birder-vs-birder-server');
module.exports = firebaseApp;