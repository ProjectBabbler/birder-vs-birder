module.exports = {
    'Test basic content renders': (browser) => {
        var baseUrl = 'http://www-local.birdervsbirder.com';

        browser
            .url(baseUrl)
            .getLogTypes(function(result) {
                console.log(result);
            })
            .getLog('browser', function(result) {
                console.log(result);
            })
            .expect.element('body').text.to.contain('Birder Vs Birder').after(20000);
        browser
            .end();
    },
};