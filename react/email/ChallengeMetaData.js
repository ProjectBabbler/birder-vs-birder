var React = require('react');

var ChallengeMetaData = (props) => {
    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <h3>Looks like someone has been busy birding.  The rankings have changed.</h3>
                        <a href={`http://www.birdervsbirder.com/challenge?id=${props.challengeKey}`}>
                            <h3>Updates for "{props.challenge.name}"</h3>
                        </a>
                        <p>
                            {props.challenge.time} list for {props.challenge.code}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

module.exports = ChallengeMetaData;