// This file is in the react folder only because it uses the spread(...) operator.
var Keys = require('../../../utils/Keys'); // This file will be in the bin folder.
var ebird = require('ebird');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);
var UserUtils = require('./UserUtils');

var scrapeEbird = (uid, userData, location, time, area, startMonth, endMonth) => {
    var instance = new ebird();
    var password = cryptr.decrypt(userData.ebird_password);
    return instance.auth(userData.ebird_username, password).then(() => {
        return instance.targets.species({
            location,
            startMonth,
            endMonth,
            locationFilter: area,
            timeFilter: time,
        });
    }).then(targets => {
        return {
            user: {
                uid,
                fullname: userData.fullname,
            },
            targets,
        };
    });
};

var getTarget = (uid, location, time, area, startMonth, endMonth) => {
    return UserUtils.getUserData(uid).then(data => {
        return scrapeEbird(uid, data, location, time, area, startMonth, endMonth);
    });
};

var getTargets = (users, location, time, area, startMonth, endMonth) => {
    var ps = users.map(user => {
        return getTarget(user, location, time, area, startMonth, endMonth);
    });

    return Promise.all(ps);
};

module.exports = {
    getTargets,
    getTarget,
};
