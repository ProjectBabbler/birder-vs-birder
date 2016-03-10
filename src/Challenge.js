var React = require('react');
var HomePanel = require('./HomePanel');
var Firebase = require('firebase');
var firebaseRef = new Firebase('https://blazing-inferno-9225.firebaseio.com/');
var ReactFireMixin = require('reactfire');
var { Label, DropdownButton, Glyphicon }= require('react-bootstrap');
var Confirm = require('react-confirm-bootstrap');
var Radium = require('radium');


var Challenge = Radium(React.createClass({
    mixins: [ReactFireMixin],

    contextTypes: {
        authData: React.PropTypes.object.isRequired,
    },

    getInitialState() {
        return {
            members: [],
            deleting: false,
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
                            userKey: result[0].key(),
                            total: result[1].val() || {},
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

    onDelete() {
        this.setState({
            deleting: true,
        });
        var ps = [];
        this.state.members.forEach(user => {
            ps.push(firebaseRef.child('users').child(user.userKey).child('challenges').child(this.props.id).set(null));
        });
        ps.push(this.challengesRef.set(null));

        Promise.all(ps).catch((e) => {
            console.log(e);
            this.setState({
                deleting: false,
            });
        });
    },

    componentWillUnmount() {
        this.challengesRef.child('members').off('value');
    },

    renderSettings() {
        var menuStyle = {
            display: 'block',
            padding: '3px 20px',
            clear: 'both',
            fontWeight: '400',
            lineHeight: '1.42857143',
            color: '#333 !important',
            whiteSpace: 'nowrap',

            ':hover': {
                color: '#262626',
                textDecoration: 'none',
                backgroundColor: '#f5f5f5',
            },
        };

        return (
            <DropdownButton title={<Glyphicon glyph="cog" />} id={`delete-${this.props.id}`} bsSize="small">
                <Confirm
                    onConfirm={this.onDelete}
                    body="Are you sure you want to delete this challenge? It can't be undone"
                    confirmText="Confirm"
                    title={`Delete "${this.props.challenge.name}"`}>
                    <div style={menuStyle}>Delete</div>
                </Confirm>
            </DropdownButton>
        );
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

        var max;
        if (sorted.length) {
            max = sorted[0].total[this.props.challenge.time];
        }

        return (
            <HomePanel>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        {labels}
                    </div>
                    {this.renderSettings()}
                </div>
                <h3>{this.props.challenge.name}</h3>
                {sorted.map(m => {
                    var value = m.total[this.props.challenge.time] || 0;
                    return (
                        <div key={m.user.ebird_username} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div style={{
                                position: 'relative',
                                width: '100%',
                            }}>
                                <div
                                    style={{
                                        width: `${(value / max) * 100}%`,
                                        height: 40,
                                        marginBottom: 3,
                                        borderRadius: 3,
                                        color: 'black',
                                        backgroundColor: '#5bc0de',
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    left: 10,
                                    top: 10,
                                }}>
                                    {m.user.ebird_username}
                                </div>
                            </div>
                            <div style={{
                                width: 50,
                                textAlign: 'right',
                            }}>
                                {value}
                            </div>
                        </div>
                    );
                })}
            </HomePanel>
        );
    },
}));

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
        if (!this.state.challenge || this.state.deleting) {
            return <div/>;
        }

        return <Challenge {...this.props} challenge={this.state.challenge} />;
    },
});

module.exports = ChallengeWrapper;

