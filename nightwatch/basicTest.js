module.exports = {
    'Test basic content renders': (browser) => {
        var baseUrl = 'http://localhost:8000';

        browser
            .url(baseUrl)
            .expect.element('.navbar-brand').text.to.contain('Birder Vs Birder').after(20000);
        browser
            .end();
    },
};