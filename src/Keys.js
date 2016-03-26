module.exports = {
    cryptr: process.env.cryptr,
    firebase: process.env.firebase,
    postmark: process.env.POSTMARK_API_KEY || 'dummy',
    stripe: process.env.STRIPE_KEY,
    ironcacheProject: process.env.IRON_CACHE_PROJECT,
    ironcacheToken: process.env.IRON_CACHE_TOKEN,
    mailchimp: process.env.MAILCHIMP_API,
    newrelic: process.env.NEWRELIC,
};