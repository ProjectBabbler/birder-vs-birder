var React = require('react');
var LoadingOverlay = require('./LoadingOverlay');
var axios = require('axios');
var BirdListGraph = require('./BirdListGraph');
var UserUtils = require('../utils/UserUtils');
var ListBadge = require('./ListBadge');
var DocMeta = require('react-doc-meta');

import {
  ShareButtons,
  generateShareIcon
} from 'react-share';

const {
  FacebookShareButton,
} = ShareButtons;
const FacebookIcon = generateShareIcon('facebook');



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

    componentWillReceiveProps(nextProps) {
        this.getUserData(nextProps);
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

    renderFBButton() {
        return (
            <FacebookShareButton
                url={`http://www.birdervsbirder.com/user/${this.props.params.username}`}
                title={'Birder Vs Birder'}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <FacebookIcon
                        size={32}
                        round={true}
                    />
                    <a style={{marginLeft: 5}}>Share on Facebook</a>
                </div>
            </FacebookShareButton>
        );
    },

    render() {
        if (!this.state.userData || !this.state.totals) {
            return <LoadingOverlay isOpened={true} />;
        }

        return (
            <div style={{
                position: 'relative',
            }}>
                {this.state.userData.shareImage ? (
                    <DocMeta
                        tags={[
                            {
                                property: 'og:image',
                                content: this.state.userData.shareImage.url,
                            }
                        ]}
                    />
                ) : null}
                <LoadingOverlay isOpened={this.state.loading} />
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    fontStyle: 'italic',
                }}>
                    Graphs updated every 4 hours
                    <br/>
                    {this.renderFBButton()}
                </div>
                <h3 style={{marginBottom: 30}}>{this.state.userData.fullname}</h3>
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
