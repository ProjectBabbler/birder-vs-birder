module.exports = {
    'Renders welcome page on / and /home': (browser) => {
        var baseUrl = browser.globals.baseUrl;

        browser
            .url(baseUrl)
            .assert.urlEquals(baseUrl)
            .expect.element('.test-logo').to.have.attribute('src').which.contains('logo.svg');
        browser
            .click('.test-nav-brand')
            .assert.urlEquals(baseUrl + 'home')
            .expect.element('#root').text.to.contain('TRACK AND COMPETE');
        browser
            .end();
    },
};
