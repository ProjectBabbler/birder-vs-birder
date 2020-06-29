// This file is in the react folder only because it uses the spread(...) operator.
var Keys = require('../../../utils/Keys'); // This file will be in the bin folder.
var ebird = require('ebird');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);
var birdList = require('bird-list');
var UserUtils = require('./UserUtils');
let AuthException = require('./AuthException');

let cache = {};

var getCacheKey = (user, code, time) => {
    return `${user.data.ebird_username}${code}${time}`;
};

var getCachedData = (user, code, time, options = { force: false }) => {
    if (options.force) {
        return null;
    }

    var cacheKey = getCacheKey(user, code, time);
    if (cache[cacheKey]) {
        return cache[cacheKey];
    } else {
        return null;
    }
};

var saveCachedData = (data, user, code, time, options = { force: false }) => {
    var cacheKey = getCacheKey(user, code, time);
    cache[cacheKey] = JSON.stringify(data);
};

var scrapeEbird = (user, code, time, options) => {
    var instance = new ebird();
    var password = cryptr.decrypt(user.data.ebird_password);
    return instance
        .auth(user.data.ebird_username, password)
        .catch(() => {
            // Auth issue.
            throw new AuthException();
        })
        .then(token => {
            return instance.list(code, time);
        })
        .then(list => {
            return {
                user: user,
                list: list,
            };
        });
};

var curateData = data => {
    var { list } = data;

    var ps = [];

    list.forEach(s => {
        ps.push(
            birdList.getBySpeciesCode(s.speciesCode).then(data => {
                return {
                    ...s,
                    ...data,
                };
            })
        );
    });

    return Promise.all(ps).then(results => {
        return {
            ...data,
            list: results,
        };
    });
};

var getList = (user, code, time, options = { force: false }) => {
    if (!user.data) {
        return;
    }
    let result = getCachedData(user, code, time, options);
    if (result) {
        return result;
    }

    return scrapeEbird(user, code, time, options)
        .then(data => {
            return curateData(data);
        })
        .then(curatedData => {
            saveCachedData(curatedData, user, code, time, options);
            return curatedData;
        });
};

var getLists = (users, code, time, options = { force: false }) => {
    var ps = users.map(user => {
        return getList(user, code, time, options);
    });

    return Promise.all(ps);
};

var getListByUserId = (uid, code, time, options = { force: false }) => {
    return UserUtils.getUserData(uid)
        .then(data => {
            return getList(
                {
                    key: uid,
                    data: data,
                },
                code,
                time
            );
        })
        .then(list => {
            return list.list;
        });
};

module.exports = {
    getLists,
    getList,
    getListByUserId,
};
