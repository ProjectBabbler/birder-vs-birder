var React = require('react');
var StripeCheckout = require('react-stripe-checkout');
var { Button, Modal, Input } = require('react-bootstrap');
var axios = require('axios');

var Donate = React.createClass({
    contextTypes: {
        userData: React.PropTypes.object,
    },

    getDefaultProps() {
        return {
            size: 'xsmall',
        };
    },

    getInitialState() {
        return {
            amount: 10,
            opened: false,
        };
    },

    onToken(token) {
        this.close();

        axios.post('/api/donate', {
            token: token.id,
            amount: this.toCents(this.state.amount),
        }).then((result) => {

        }).catch((err) => {
            console.log(err);
        });
    },

    toCents(v) {
        return v * 100;
    },

    renderDonate() {
        return (
            <StripeCheckout
              name="Birder Vs Birder"
              panelLabel="Donate"
              amount={this.toCents(this.state.amount)}
              email={this.context.userData.email}
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

    open() {
        this.setState({
            opened: true,
        });
    },

    close() {
        this.setState({
            opened: false,
        });
    },

    onAmountChange(value) {
        this.setState({
            amount: parseInt(this.refs.amount.getValue()) || 0,
        });
    },

    render() {
        return (
            <div>
                <Button bsSize={this.props.size} onClick={this.open}>
                    Donate
                </Button>
                <Modal show={this.state.opened} onHide={this.close}>
                    <Modal.Header closeButton={true}>
                        <Modal.Title>Donate to Birder Vs Birder</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{
                            width: 150,
                            margin: 'auto',
                        }}>
                            <Input
                                label="Amount"
                                ref="amount"
                                onChange={this.onAmountChange}
                                type="text"
                                addonBefore="$"
                                value={this.state.amount}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {this.renderDonate()}
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
});

module.exports = Donate;