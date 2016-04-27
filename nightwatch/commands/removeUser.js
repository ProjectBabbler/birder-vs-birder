var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');

exports.command = function(id, callback) {
    firebaseRef.removeUser({
        email    : `projectbabbler+test+${id}@gmail.com`,
        password : 'babblebabble'
    }).then(() => {
        callback();
    });

    return this;
};