module.exports = {
    cryptr: process.env.cryptr,
    firebase: process.env.firebase,
    postmark: process.env.POSTMARK_API_TOKEN,
    stripe: process.env.STRIPE_KEY,
    newrelic: process.env.NEWRELIC,
    firebaseServiceKey: process.env.FIREBASE_SERVICE_KEY.replace(/\\n/g, '\n'),
};
