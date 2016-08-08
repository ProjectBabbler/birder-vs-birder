module.exports = {
    'Renders donate page': (browser) => {
        var baseUrl = browser.globals.baseUrl + '/donate';

        browser
            .url(baseUrl)
            .expect.element('body').text.to.contains('Donate to Birder Vs Birder');
        browser
            .end();
    },
};