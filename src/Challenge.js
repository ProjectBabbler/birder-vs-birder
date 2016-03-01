var React = require('react');
var HomePanel = require('./HomePanel');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var { Label }= require('react-bootstrap');

var Challenge = React.createClass({
    mixins: [ReactFireMixin],

    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            members: [],
        };
    },

    componentWillMount() {
        this.challengesRef = firebaseRef.child('challenges').child(this.props.id);
        this.challengesRef.child('members').on('value', snap => {
            var ps = [];
            snap.forEach(member => {
                ps.push(new Promise((resolve, reject) => {
                    Promise.all([
                        firebaseRef.child('users').child(member.key()).once('value'),
                        firebaseRef.child('ebird/totals').child(member.key()).child(this.props.challenge.code).once('value'),
                    ]).then(result => {
                        return {
                            user: result[0].val(),
                            total: result[1].val(),
                        };
                    }).then(resolve).catch(reject);
                }));
            });

            Promise.all(ps).then(results => {
                this.setState({
                    members: results,
                });
            });
        });
    },

    componentWillUnmount() {
        this.challengesRef.child('members').off('value');
    },

    render() {
        var badgeStyle = {
            marginRight: 10,
        };

        var labels = [];
        if (this.context.authData.uid == this.props.challenge.owner) {
            labels.push(<Label bsStyle="primary" key="owner" style={badgeStyle}>Owner</Label>);
        }
        labels.push(<Label bsStyle="info" key="time" style={badgeStyle}>{this.props.challenge.time}</Label>);
        labels.push(<Label bsStyle="info" key="code" style={badgeStyle}>{this.props.challenge.code}</Label>);

        var sorted = this.state.members.sort((a, b) => {
            return b.total[this.props.challenge.time] - a.total[this.props.challenge.time];
        });

        return (
            <HomePanel>
                {labels}
                <h3>{this.props.challenge.name}</h3>
                {sorted.map(m => {
                    return (
                        <div key={m.user.ebird_username}>{m.user.ebird_username} {m.total[this.props.challenge.time]}</div>
                    );
                })}
            </HomePanel>
        );
    },
});

var ChallengeWrapper = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState() {
        return {
            challenge: null,
        };
    },

    componentWillMount() {
        this.challengesRef = firebaseRef.child('challenges').child(this.props.id);
        this.bindAsObject(this.challengesRef, 'challenge');
    },

    render() {
        if (!this.state.challenge) {
            return <div/>;
        }

        return <Challenge {...this.props} challenge={this.state.challenge} />
    },
});

module.exports = ChallengeWrapper;

