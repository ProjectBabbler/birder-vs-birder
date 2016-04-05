module.exports = {
    'Test basic content renders': (browser) => {
        var baseUrl = 'http://www.birdervsbirder.com';

        browser
            .url(baseUrl)
            .expect.element('.navbar-brand').text.to.contain('Birder Vs Birder').after(50000);
        browser
            .end();
    },
};