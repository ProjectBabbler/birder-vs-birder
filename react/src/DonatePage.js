var React = require('react');
var StripeCheckout = require('react-stripe-checkout');
var { Button, FormControl, FormGroup, InputGroup } = require('react-bootstrap');
var axios = require('axios');
import { browserHistory } from 'react-router';
var LoadingOverlay = require('./LoadingOverlay');


var DonatePage = React.createClass({
    contextTypes: {
        userData: React.PropTypes.object,
    },

    getInitialState() {
        return {
            amount: 10,
            loading: false,
        };
    },

    onToken(token) {
        this.setState({
            loading: true,
        });

        axios.post('/api/donate', {
            token: token.id,
            amount: this.toCents(this.state.amount),
        }).then((result) => {
            browserHistory.push({
                pathname: '/thankyou',
            });
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    },

    toCents(v) {
        return v * 100;
    },

    renderDonate() {
        var email = this.context.userData ? this.context.userData.email : null;
        return (
            <StripeCheckout
              name="Birder Vs Birder"
              panelLabel="Donate"
              amount={this.toCents(this.state.amount)}
              email={email}
              currency="USD"
              stripeKey="pk_live_SWZrCFMxbrwAy5gUHoMZAvnc"
              allowRememberMe={true}
              token={this.onToken}>
                <Button bsStyle="primary">
                    Enter Credit Card info
                </Button>
            </StripeCheckout>
        );
    },

    onAmountChange(e) {
        this.setState({
            amount: parseInt(e.target.value) || 0,
        });
    },

    render() {
        return (
            <div>
                <LoadingOverlay isOpened={this.state.loading} />
                <h3>Donate to Birder Vs Birder</h3>
                <p>
                    Thank you for being a member of the Birder Vs Birder community.
                    Please help Birder Vs Birder stay up and running.
                    Your donations go towards the costs of running our servers and building new features.
                </p>
                <div style={{
                    width: 150,
                    margin: 'auto',
                }}>
                    <FormGroup>
                        <InputGroup>
                            <InputGroup.Addon>$</InputGroup.Addon>
                            <FormControl
                                label="Amount"
                                onChange={this.onAmountChange}
                                type="text"
                                value={this.state.amount}
                            />
                        </InputGroup>
                    </FormGroup>
                </div>
                {this.renderDonate()}
            </div>
        );
    }
});

module.exports = DonatePage;