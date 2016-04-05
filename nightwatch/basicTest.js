module.exports = {
    'Test basic content renders': (browser) => {
        var baseUrl = 'http://www.birdervsbirder.com';

        browser
            .url(baseUrl)
            .expect.element('title').text.to.contain('Birder vs Birder').after(2000);
        browser
            .end();
    },
};