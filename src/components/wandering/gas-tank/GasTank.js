import React, { Component } from 'react';
import GaugeChart from '../../../components/shared/gauge-chart/GaugeChart.js';

import './GasTank.scss';

class GasTank extends Component {
  state = {
    amount: '',
    balance: '',
    error: null,
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

  handleSubmit = async () => {
    const { onSubmit } = this.props;
    const transfer = { ...this.state };

    if (!transfer.amount) {
      this.setState({
        error: 'Enter an amount',
      });
      console.error(this.state.error);
      return;
    }

    await onSubmit(transfer);

    this.setState({
      amount: '',
      error: '',
    });

    this.getBalance();
  };

  render() {
    const gasValue = this.state.balance * 500;

    return (
      <div className="GasTank">
        <div className="GasTank__gas">
          <GaugeChart gasValue={gasValue} />
          <div className="label--empty">E</div>
          <div className="label--full">F</div>
          <p>{this.state.balance} ETH</p>
        </div>
        <div className="GasTank__info">
          <h5>GAS TANK</h5>
          {this.state.balance > 0.1 && (
            <p className="color--success">Gas is Healthy!</p>
          )}
          {this.state.balance <= 0.1 && (
            <p className="color--danger">Gas is dangerously low!</p>
          )}
          <div>
            <input
              className="Wandering__address-input"
              type="text"
              placeholder="Amount of ETH"
              value={this.state.amount}
              onChange={this.handleChange}
            />
            {this.state.error ? (
              <p className="tiny">{this.state.error}</p>
            ) : null}
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
