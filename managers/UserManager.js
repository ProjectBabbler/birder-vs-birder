var ebirdToFirebase = require('../routes/ebirdToFirebase');


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
    }
};

module.exports = UserManager;