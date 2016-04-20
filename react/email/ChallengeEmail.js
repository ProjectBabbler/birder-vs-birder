var Layout = require('./Layout');
var React = require('react');
var ChallengeMetaData = require('./ChallengeMetaData');
var ChallengeList = require('./ChallengeList');


var ChallengeEmail = (props) => {
    return (
        <Layout>
            <ChallengeMetaData challenge={props.challenge} challengeKey={props.challengeKey} />
            <ChallengeList changes={props.changes} userKey={props.userKey} />
        </Layout>
    );
};

module.exports = ChallengeEmail;