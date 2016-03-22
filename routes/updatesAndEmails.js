var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var emailUser = require('./emailUser');
var Keys = require('../src/Keys');
var UsersManager = require('../managers/UsersManager');


var ref = firebaseRef.child('users');
ref.authWithCustomToken(Keys.firebase).then(() => {
    return UsersManager.updateTotals();
}).then(() => {
    return ref.once('value');
}).then((s) => {
    // Update totals.
    var ps = [];
    s.forEach(cs => {
        var userData = cs.val();
        var userKey = cs.key();
        console.log(`Gathering and emailing for ${userKey}`);
        ps.push(emailUser(userKey, userData.email));
    });

    return Promise.all(ps);
}).then(() => {
    process.exit(0);
}).catch(e => {
    console.log(e);
    process.exit(1);
});