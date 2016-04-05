module.exports = {
    'Test basic content renders': (browser) => {
        var baseUrl = 'http://www.birdervsbirder.com';

        browser
            .url(baseUrl)
            .waitForElementPresent('.navbar-brand', 20000)
            .expect.element('body').text.to.contain('Birder Vs Birder').after(2000);
        browser
            .end();
    },
};