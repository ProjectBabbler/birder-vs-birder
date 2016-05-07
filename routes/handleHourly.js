var ChallengesManager = require('../managers/ChallengesManager');
var UsersManager = require('../managers/UsersManager');

// Only run this on every fourth hour.
var moment = require('moment');
if (moment().hour() % 4 != 0) {
    process.exit(0);
} else {
    ChallengesManager.updateCache().then(() => {
        return UsersManager.updateCache();
    }).then(() => {
        process.exit(0);
    }).catch(e => {
        console.error(e);
        process.exitCode = 1;
    });
}
