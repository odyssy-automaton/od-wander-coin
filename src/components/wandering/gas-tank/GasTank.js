import React, { Component } from 'react';

class GasTank extends Component {
  state = {
    amount: '',
    balance: '',
  };

  componentDidMount() {
    this.getBalance();
  }

  getBalance = async () => {
    const { onLoad } = this.props;
    const gasBalance = await onLoad();
    this.setState({ balance: gasBalance });
  };

  handleChange = (e) => {
    this.setState({ amount: e.target.value });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const transfer = { ...this.state };
    onSubmit(transfer);

    this.setState({ amount: '' });
    this.getBalance();
  };

  render() {
    return (
      <div className="GasTank">
        <div className="GasTank__gas">
          <div className="GasTank__bar" />
        </div>
        <div className="GasTank__info">
          <h5>GAS TANK</h5>
          {this.state.balance > 0.1 && (
            <p className="color--success">Gas is healthy! ({this.state.balance} ETH)</p>
          )}
          {this.state.balance <= 0.1 && (
            <p className="color--danger">Gas is dangerously low! ({this.state.balance} ETH)</p>
          )}
          <div>
            <input
              className="Wandering__address-input"
              type="text"
              placeholder="Amount of ETH"
              value={this.state.amount}
              onChange={this.handleChange}
            />
            <button className="button" onClick={this.handleSubmit}>
              GIVE ME SOME GAS
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default GasTank;
