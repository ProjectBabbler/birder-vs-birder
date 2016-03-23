var moment = require('moment');
var UsersManager = require('../managers/UsersManager');

UsersManager.updateTotals().then(() => {
    // If Sunday
    if (moment().day() == 0) {
        return UsersManager.emailWeekly();
    } else {
        return;
    }
}).then(() => {
    process.exit(0);
}).catch(e => {
    console.log(e);
    process.exit(1);
});