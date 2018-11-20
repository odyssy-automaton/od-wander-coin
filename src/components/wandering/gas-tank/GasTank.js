import React, { Component } from 'react';
import GaugeChart from '../../../components/shared/gauge-chart/GaugeChart.js'

import './GasTank.scss'

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
    this.chartValue = this.state.balance * 1000;
  };

  render() {
    // Set percentage
    const chartValue = (this.state.balance * 500);
    return (
      <div className="GasTank">
        <div className="GasTank__gas">
          <h5>GAS TANK</h5>
          <GaugeChart dataKey={chartValue}/>
        </div>
        <div className="GasTank__info">
          {this.state.balance > 0.01 && (
            <p className="color--success">Gas is Healthy! ({this.state.balance} ETH)</p>
          )}
          {this.state.balance <= 0.01 &&  (
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
