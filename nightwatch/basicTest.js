module.exports = {
    'Test basic content renders': (browser) => {
        var baseUrl = 'http://www-local.birdervsbirder.com';

        browser
            .url(baseUrl)
            .expect.element('body').text.to.contain('Birder Vs Birder').after(2000);
        browser
            .end();
    },
};