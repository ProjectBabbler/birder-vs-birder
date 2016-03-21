module.exports = {
    'Test basic content renders': (browser) => {
        var baseUrl = 'http://localhost:5000';
        browser
            .url(baseUrl)
            .expect.element('.navbar-brand').text.to.contain('Birder Vs Birder').after(10000);
        browser
            .end();
    },
};