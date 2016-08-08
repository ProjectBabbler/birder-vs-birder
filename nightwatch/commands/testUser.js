exports.command = function() {
    this.deleteCookies();
    var baseUrl = this.globals.baseUrl + 'signin';
    this
        .url(baseUrl)
        .waitForElementPresent('#test-username', 5000)
        .setValue('#test-username', 'greg@boostable.com')
        .setValue('#test-password', process.env.TRAVIS_SAMPLE_PASSWORD)
        .submitForm('#test-login-form')
        .waitForElementNotPresent('#test-login-form', 20000);

    return this;
};