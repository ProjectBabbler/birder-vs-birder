var Layout = require('./Layout');
var SectionList = require('./SectionList');
var React = require('react');

var UpdateEmail = (props) => {
    var hasUpdates = false;
    props.sections.forEach((m) => {
        hasUpdates = hasUpdates || m.lineItems.length != 0;
    });

    var titleStyle = {
        fontSize: '26px',
    };

    var content;
    if (hasUpdates) {
        content = (
            <div>
                <p style={titleStyle}>Nice job birding this week.  Here are all your updates</p>
                {props.sections.map((s) => {
                    return <SectionList {...s} key={s.list} />;
                })}
            </div>
        );
    } else {
        content = (
            <p style={titleStyle}>No new birds this week.  Good luck birding.</p>
        );
    }

    return (
        <Layout>
            {content}
        </Layout>
    );
};

module.exports = UpdateEmail;