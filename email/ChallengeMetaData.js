var React = require('react');

var ChallengeMetaData = (props) => {
    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <a href={`http://www.birdervsbirder.com/challenge?id=${props.challengeKey}`}>
                            <h3>Updates for "{props.challenge.name}"</h3>
                        </a>
                        <p>
                            {props.challenge.time} life for {props.challenge.code}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

module.exports = ChallengeMetaData;