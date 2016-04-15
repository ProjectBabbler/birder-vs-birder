module.exports = {
    'Renders profile page': (browser) => {
        var baseUrl = browser.globals.baseUrl;

        browser
            .testUser()
            .click('.test-nav-user-dropdown')
            .click('.test-profile-link')
            .assert.urlEquals(baseUrl + 'user/projectbabblertest1')
            .expect.element('body').text.to.contain('ABC').after(1000);
        browser
            .expect.element('.test-loading-overlay').to.not.be.present.after(5000);
        browser
            .end();
    },
};