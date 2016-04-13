var moment = require('moment');
var UsersManager = require('../managers/UsersManager');
var ChallengesManager = require('../managers/ChallengesManager');
var CleanUpManager = require('../managers/CleanUpManager');


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
    return CleanUpManager.cleanUpOldData();
}).then(() => {
    process.exit(0);
}).catch(e => {
    console.log(e);
    process.exit(1);
});