var moment = require('moment');
var UsersManager = require('../managers/UsersManager');
var ChallengesManager = require('../managers/ChallengesManager');
var CleanUpManager = require('../managers/CleanUpManager');

CleanUpManager.cleanUpOldData().then(() => {
    return UsersManager.updateTotals();
}).then(() => {
    // If Sunday
    if (moment().day() == 1) {
        return UsersManager.emailWeekly();
    } else {
        return;
    }
}).then(() => {
    return UsersManager.takeShareScreenShots();
}).then(() => {
    return ChallengesManager.updateSnapshots();
}).then(() => {
    return ChallengesManager.emailChanges();
}).then(() => {
    return CleanUpManager.cleanUpOldData();
}).then(() => {
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
