var ebirdToFirebase = require('../routes/ebirdToFirebase');
var webshot = require('webshot');
var UserUtils = require('../bin/react/utils/UserUtils');
var ReactDOMServer = require('react-dom/server');
var ListBadge = require('../bin/react/src/ListBadge');
var React = require('react');
var cloudinary = require('cloudinary');
var deferred = require('deferred');
var userListsUtils = require('../bin/react/utils/userListsUtils');
var chalk = require('chalk');


var UserManager = {
    fetchTotals(uid) {
        var ebird = new ebirdToFirebase(uid);
        return ebird.auth().then(() => {
            console.log(`Fetching totals for ${uid}`);
            return ebird.totals().then(r => {
                console.log(`Finish fetching totals for ${uid}`);
                return r;
            });
        });
    },

    takeShareScreenShot(key, data) {
        var file = `public/static/images/fb_share/share_screen_${key}.png`;
        return new Promise((resolve, reject) => {
            console.log('Taking snaphot for ' + key);
            UserUtils.getRecentTotalsRef(key).then(totalsRef => {
                return totalsRef.once('value');
            }).then(snap => {
                var totals = snap.val();
                var world = totals.WORLD.life;

                var html = ReactDOMServer.renderToStaticMarkup(React.createElement(ListBadge, {
                    total: world,
                    list: 'World',
                }));

                webshot(
                    `<html><body>${html}</body></html>`,
                    file,
                    {
                        siteType: 'html',
                        screenSize: {
                            width: 275,
                            height: 350,
                        }
                    },
                    (err) => {
                        console.log('snapshot taken for ' + key);
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            });
        }).then(() => {
            return new Promise((resolve, reject) => {
                UserUtils.getFBShareImage(key).then(imageData => {
                    var options = {};

                    if (imageData) {
                        options = {
                            public_id: imageData.public_id,
                        };
                    }

                    cloudinary.uploader.upload(file, (result) => {
                        UserUtils.saveFBShareImage(key, result).then(resolve).catch(reject);
                    }, options);
                });
            });
        });
    },

    updateCache(user) {
        if (user.data.invalid_auth) {
            return;
        }

        return userListsUtils.getList(user, 'WORLD', 'life', {force: true}).then(() => {
            console.log(`Updated world cache for ${user.key}`);
        }).catch(e => {
            // Catch error but don't let it stop the process.
            console.error(chalk.red(`Error updating cache for ${user.key}`), e);
        });
    }
};

for (var key in UserManager) {
    UserManager[key] = deferred.gate(UserManager[key], 3);
}

module.exports = UserManager;
