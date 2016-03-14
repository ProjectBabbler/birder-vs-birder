var Layout = require('./Layout');
var SectionList = require('./SectionList');
var React = require('react');

var UpdateEmail = (props) => {
    var hasUpdates = false;
    props.sections.forEach((m) => {
        hasUpdates = m.lineItems.length != 0;
    });

    var content;
    if (hasUpdates) {
        content = (
            <div>
                <p>Nice job birding this week.  Here are all your updates</p>
                {props.sections.map((s) => {
                    return <SectionList {...s} key={s.list} />;
                })}
            </div>
        );
    } else {
        content = (
            <p>No new birds this week.  Good luck birding.</p>
        );
    }

    return (
        <Layout>
            {content}
        </Layout>
    );
};

module.exports = UpdateEmail;