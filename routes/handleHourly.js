var ChallengesManager = require('../managers/ChallengesManager');
var UsersManager = require('../managers/UsersManager');
var chalk = require('chalk');

ChallengesManager.updateCache().then(() => {
    return UsersManager.updateCache();
}).then(() => {
    process.exit(0);
}).catch(e => {
    console.error(chalk.red('Error'), e);
    process.exitCode = 1;
});
