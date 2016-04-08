module.exports = {
    'Sign In and go to dashboard': (browser) => {
        var baseUrl = browser.globals.baseUrl;

        browser
            .testUser()
            // Rediect to dashboard
            .assert.urlEquals(baseUrl)
            // User's name show's up.
            .expect.element('.navbar').text.to.contains('projectbabblertest1');
        browser
            // Dashboard link shows up
            .expect.element('.navbar').text.to.contains('Dashboard');
        browser
            .end();
    },
};