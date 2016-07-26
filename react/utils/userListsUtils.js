// This file is in the react folder only because it uses the spread(...) operator.
var Keys = require('../../../utils/Keys'); // This file will be in the bin folder.
var ebird = require('ebird');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);
var ironcache = require('iron-cache');
var client = ironcache.createClient({ project: Keys.ironcacheProject, token: Keys.ironcacheToken });
var birdList = require('bird-list');
var UserUtils = require('./UserUtils');
var firebase = require('../firebase');
var firebaseRef = firebase.database();


var getCacheKey = (user, code, time) => {
    return `${user.data.ebird_username}${code}${time}`;
};

var getCachedData = (user, code, time, options={force: false}) => {
    return new Promise((resolve, reject) => {
        if (options.force) {
            resolve(null);
            return;
        }

        var cacheKey = getCacheKey(user, code, time);
        client.get('birdLists', cacheKey, (err, res) => {
            if (err) {
                // Ok if cache fails.
                resolve(null);
            } else {
                var result = JSON.parse(res.value);
                resolve(result);
            }
        });
    });
};

var saveCachedData = (data, user, code, time, options={force: false}) => {
    return new Promise((resolve, reject) => {
        var config = {
            value: JSON.stringify(data),
            expires_in: 60 * 60 * 4, // 4 hours
        };
        var cacheKey = getCacheKey(user, code, time);
        client.put('birdLists', cacheKey, config, (err, res) => {
            if (err) {
                console.log(err);
                // Ok if cache fails.
            }
            resolve();
        });
    });
};


var scrapeEbird = (user, code, time, options) => {
    var instance = new ebird(user.data.ebird_token);
    var password = cryptr.decrypt(user.data.ebird_password);
    return instance.auth(user.data.ebird_username, password).then(token => {
        return firebaseRef.ref('users').child(user.key).child('ebird_token').set(token);
    }).then((token) => {
        return instance.list(code, time);
    }).then(list => {
        return {
            user: user,
            list: list,
        };
    });
};

var curateData = (data) => {
    var {list} = data;

    var ps = [];

    list.forEach(s => {
        ps.push(birdList.getBySpeciesCode(s.speciesCode).then(data => {
            return {
                ...s,
                ...data,
            };
        }));
    });

    return Promise.all(ps).then(results => {
        return {
            ...data,
            list: results,
        };
    });
};

var getList = (user, code, time, options={force: false}) => {
    if (!user.data) {
        return;
    }
    return getCachedData(user, code, time, options).then(result => {
        if (result) {
            return result;
        }

        return scrapeEbird(user, code, time, options).then(data => {
            return curateData(data);
        }).then(curatedData => {
            return saveCachedData(curatedData, user, code, time, options).then(() => {
                return curatedData;
            });
        });
    });
};

var getLists = (users, code, time, options={force: false}) => {
    var ps = users.map(user => {
        return getList(user, code, time, options);
    });

    return Promise.all(ps);
};

var getListByUserId = (uid, code, time, options={force: false}) => {
    return UserUtils.getUserData(uid).then(data => {
        return getList({
            key: uid,
            data: data,
        }, code, time);
    }).then(list => {
        return list.list;
    });
};

module.exports = {
    getLists,
    getList,
    getListByUserId,
};
