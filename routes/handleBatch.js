var moment = require('moment');
var UsersManager = require('../managers/UsersManager');
var ChallengesManager = require('../managers/ChallengesManager');


UsersManager.updateTotals().then(() => {
    // If Sunday
    if (moment().day() == 1) {
        return UsersManager.emailWeekly();
    } else {
        return;
    }
}).then(() => {
    return ChallengesManager.updateSnapshots();
}).then(() => {
    return ChallengesManager.emailChanges();
}).then(() => {
    process.exit(0);
}).catch(e => {
    console.log(e);
    process.exit(1);
});