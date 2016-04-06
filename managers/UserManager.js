var ebirdToFirebase = require('../routes/ebirdToFirebase');
var webshot = require('webshot');
var UserUtils = require('../utils/UserUtils');
var ReactDOMServer = require('react-dom/server');



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
                    html,
                    `public/static/images/fb_share/share_screen_${key}.png`,
                    {siteType:'html'},
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
        });
    },
};

module.exports = UserManager;