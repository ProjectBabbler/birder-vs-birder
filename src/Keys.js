module.exports = {
    cryptr: process.env.cryptr,
    firebase: process.env.firebase,
    postmark: process.env.POSTMARK_API_KEY || 'dummy',
    stripe: process.env.STRIPE_KEY,
};