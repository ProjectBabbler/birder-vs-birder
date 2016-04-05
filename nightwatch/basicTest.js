module.exports = {
    'Test basic content renders': (browser) => {
        var baseUrl = 'http://www.birdervsbirder.com:5000';

        browser
            .url(baseUrl)
            .expect.element('title').text.to.contain('Birder vs Birder').after(20000);
        browser
            .end();
    },
};