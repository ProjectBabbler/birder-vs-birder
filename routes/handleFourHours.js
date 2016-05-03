var ChallengesManager = require('../managers/ChallengesManager');

ChallengesManager.updateCache().then(() => {
    process.exit(0);
}).catch(e => {
    console.error(e);
    process.exit(1);
});
