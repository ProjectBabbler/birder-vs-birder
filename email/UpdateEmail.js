'use strict';

var Layout = require('./Layout');
var SectionList = require('./SectionList');
var React = require('react'),
    DOM = React.DOM,
    div = DOM.div,
    h1 = DOM.h1;

var UpdateEmail = function UpdateEmail(props) {
    var hasUpdates = false;
    props.sections.forEach(function (m) {
        hasUpdates = m.lineItems.length != 0;
    });

    var content;
    if (hasUpdates) {
        content = React.createElement(
            'div',
            null,
            React.createElement(
                'h1',
                null,
                'Nice job birding this week.  Here are all your updates'
            ),
            props.sections.map(function (s) {
                return React.createElement(SectionList, s);
            })
        );
    } else {
        content = React.createElement(
            'h1',
            null,
            'No new birds this week.  Good luck birding.'
        );
    }

    return React.createElement(
        Layout,
        null,
        content
    );
};

module.exports = UpdateEmail;