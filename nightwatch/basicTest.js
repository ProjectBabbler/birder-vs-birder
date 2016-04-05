module.exports = {
    'Test basic content renders': (browser) => {
        var baseUrl = 'http://localhost:5000';

        browser
            .url(baseUrl)
            .expect.element('body').text.to.contain('Birder Vs Birder').after(50000);
        browser
            .end();
    },
};