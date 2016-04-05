module.exports = {
    'Test basic content renders': (browser) => {
        var baseUrl = 'http://localhost:5000';

        browser
            .url(baseUrl)
            .getLogTypes((result) => {
                console.log(result);
            })
            .getLog('browser', (result) => {
                console.log(result);
            })
            .expect.element('.navbar-brand').text.to.contain('Birder Vs Birder').after(20000);
        browser
            .end();
    },
};