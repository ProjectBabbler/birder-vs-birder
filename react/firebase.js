var firebase = require('firebase');
var config = {
    apiKey: 'AIzaSyAgN21NhwJt6MMLxanxxsgHR712fB6QjSE',
    authDomain: 'blazing-inferno-9225.firebaseapp.com',
    databaseURL: 'https://blazing-inferno-9225.firebaseio.com',
};

let firebaseApp = firebase.initializeApp(config, 'birder-vs-birder');
module.exports = firebaseApp;