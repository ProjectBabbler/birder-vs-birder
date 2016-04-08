module.exports = {
    'Test basic content renders': (browser) => {
        var baseUrl = browser.globals.baseUrl;

        browser
            .url(baseUrl)
            .expect.element('body').text.to.contain('Birder Vs Birder').after(20000);
        browser
            .end();
    },
};