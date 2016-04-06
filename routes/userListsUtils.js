var Keys = require('../src/Keys');
var ebird = require('ebird');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(Keys.cryptr);
var ironcache = require('iron-cache');
var client = ironcache.createClient({ project: Keys.ironcacheProject, token: Keys.ironcacheToken });

var getCacheKey = (user, code, time) => {
    return `${user.data.ebird_username}${code}${time}`;
};


module.exports = {
    getLists: (users, code, time) => {
        var ps = users.map(user => {
            var cacheKey = getCacheKey(user, code, time);

            return new Promise((resolve, reject) => {
                client.get('birdLists', cacheKey, (err, res) => {
                    if (err) {
                        // Ok if cache fails.
                        resolve(null);
                    } else {
                        var result = JSON.parse(res.value);
                        resolve(result);
                    }
                });
            }).then(result => {
                if (result) {
                    return result;
                }

                var instance = new ebird();
                var password = cryptr.decrypt(user.data.ebird_password);
                return instance.auth(user.data.ebird_username, password).then(() => {
                    return instance.list(code, time).then(list => {
                        return new Promise((resolve, reject) => {
                            var data = {
                                user: user,
                                list: list,
                            };
                            var config = {
                                value: JSON.stringify(data),
                                expires_in: 60 * 60 * 4, // 4 hours
                            };
                            client.put('birdLists', cacheKey, config, (err, res) => {
                                if (err) {
                                    console.log(err);
                                    // Ok if cache fails.
                                }
                                resolve(data);
                            });
                        });
                    });
                });
            });
        });

        return Promise.all(ps);
    },
};