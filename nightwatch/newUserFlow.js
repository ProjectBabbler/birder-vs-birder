module.exports = {
    'New user flow': (browser, done) => {
        var userId = Math.random();

        browser
            .newTestUser(userId)
            // Create a challenge
            .click('.test-create-challenge-button')
            .waitForElementVisible('.test-location-search', 1000)
            .pause(5000)
            .click('.Select-placeholder')
            .setValue('.test-location-search input', ['San Francisco', browser.Keys.ENTER])
            .pause(5000)
            .click('.test-submit-challenge-button')
            .expect.element('body').text.to.contain('Life List for San Francisco').after(10000);
        browser
            .expect.element('.test-stacked-value').text.to.contain('0');

        browser
            .click('.test-challenge-menu-dropdown')
            .click('.test-delete-challenge')
            .pause(1000)
            .click('.modal-footer .btn-danger')
            .expect.element('body').text.not.to.contain('Life List for San Francisco').after(2000);

        browser.end();
    },
};