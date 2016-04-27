exports.command = function() {
    this.deleteCookies();
    var baseUrl = this.globals.baseUrl + 'signup';
    var id = Math.random();
    this
        .url(baseUrl)
        .waitForElementPresent('#test-username', 10000)
        .setValue('#test-email', `projectbabbler+test+${id}@gmail.com`)
        .setValue('#test-fullname', 'Felix Powers')
        .setValue('#test-username', 'projectbabblertest2')
        .setValue('#test-password', 'babblebabble')
        .submitForm('#test-signup-form')
        .waitForElementNotPresent('#test-signup-form', 10000);

    return this;
};