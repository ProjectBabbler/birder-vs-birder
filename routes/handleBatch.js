var moment = require('moment');
var UsersManager = require('../managers/UsersManager');
var ChallengesManager = require('../managers/ChallengesManager');


UsersManager.updateTotals().then(() => {
    // If Sunday
    if (moment().day() == 0) {
        return UsersManager.emailWeekly();
    } else {
        return;
    }
}).then(() => {
    return ChallengesManager.updateSnapshots();
}).then(() => {
    process.exit(0);
}).catch(e => {
    console.log(e);
    process.exit(1);
});