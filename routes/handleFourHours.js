var ChallengesManager = require('../managers/ChallengesManager');
var UsersManager = require('../managers/UsersManager');

ChallengesManager.updateCache().then(() => {
    return UsersManager.updateCache();
}).then(() => {
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
