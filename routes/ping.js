var request = require('request-promise');

request.get('http://www.birdervsbirder.com').then(() => {
    console.log('pinged site');
    process.exit(0);
});