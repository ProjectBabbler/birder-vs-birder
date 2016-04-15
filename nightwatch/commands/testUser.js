exports.command = function() {
    this.deleteCookies();
    var baseUrl = this.globals.baseUrl + 'signin';
    this
        .url(baseUrl)
        .waitForElementPresent('#test-username', 5000)
        .setValue('#test-username', 'greg@boostable.com')
        .setValue('#test-password', 'babblebabble')
        .submitForm('#test-login-form')
        .waitForElementNotPresent('#test-login-form', 10000);

    return this;
};