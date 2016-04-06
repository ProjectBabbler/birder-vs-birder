var React = require('react');
var LoadingOverlay = require('./LoadingOverlay');
var axios = require('axios');
var BirdListGraph = require('./BirdListGraph');
var UserUtils = require('../utils/UserUtils');
var ListBadge = require('../shared/ListBadge');
var DocMeta = require('react-doc-meta');


var UserPage = React.createClass({
    contextTypes: {
        authData: React.PropTypes.object,
        userData: React.PropTypes.object,
    },

    getInitialState() {
        return {
            loading: false,
            lists: null,
            userData: null,
            totals: null,
        };
    },

    componentDidMount() {
        this.getUserData();
    },

    getUserData(props=this.props) {
        this.setState({
            loading: true,
        });

        axios.post('/api/userLists', {
            username: props.params.username,
        }).then((results) => {
            this.setState({
                lists: results.data,
            });
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            this.setState({
                loading: false,
            });
        });

        UserUtils.getUserByName(props.params.username).then((user) => {
            this.setState({
                userData: user,
            });

            UserUtils.getRecentTotalsRef(user._key).then(totalsRef => {
                return totalsRef.once('value');
            }).then(snap => {
                var totals = snap.val();
                this.setState({
                    totals,
                });
            });
        });
    },

    render() {
        if (!this.state.userData || !this.state.totals) {
            return <LoadingOverlay isOpened={true} />;
        }

        return (
            <div style={{
                position: 'relative',
            }}>
                <DocMeta
                    tags={[
                        {
                            property: 'og:image',
                            content: `http://www.birdervsbirder.com/static/images/fb_share/share_screen_${this.state.userData._key}.png`,
                        }
                    ]}
                />
                <LoadingOverlay isOpened={this.state.loading} />
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    fontStyle: 'italic',
                }}>
                    Graphs updated every 4 hours
                </div>
                <h3>{this.state.userData.fullname}</h3>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}>
                    <div style={{
                        flexGrow: 1
                    }}>
                        <ListBadge
                            style={{
                                margin: 30,
                            }}
                            total={this.state.totals.WORLD.life}
                            list="World"
                        />
                    </div>
                    <BirdListGraph lists={this.state.lists} title="World Bird List" />
                </div>
            </div>
        );
    },
});

module.exports = UserPage;