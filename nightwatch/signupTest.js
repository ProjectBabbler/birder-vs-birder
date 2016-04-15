module.exports = {
    'Sign Up, go to dashboard, and loads your lists': (browser) => {
        var baseUrl = browser.globals.baseUrl;

        browser
            .newTestUser()
            // Rediect to dashboard
            .assert.urlEquals(baseUrl)
            // Your list header loads
            .expect.element('body').text.to.contains('Your List');
        browser
            .expect.element('body').text.to.contains("You don't have any challenges yet.");
        browser
            // Loads your list
            .expect.element('body').text.to.contains('Western Hemisphere').after(10000);
        browser
            .expect.element('body').text.to.contains('ABA Area');
        browser
            .end();
    },
};