import React, { Component } from 'react';
import GaugeChart from '../../../components/shared/gauge-chart/GaugeChart.js';

import './GasTank.scss';

class GasTank extends Component {
  state = {
    amount: '',
    balance: '',
    error: null,
    loading: false,
  };
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    this.getBalance();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getBalance = async () => {
    const { onLoad } = this.props;
    const gasBalance = await onLoad();
    if (this._isMounted) {
      this.setState({ balance: gasBalance });
    }
  };

  handleChange = (e) => {
    this.setState({ amount: e.target.value });
  };

  handleSubmit = async () => {
    const { onSubmit } = this.props;
    const transfer = { ...this.state };
    this.setState({
      loading: true,
    });

    if (!transfer.amount) {
      this.setState({
        error: 'Enter an amount',
        loading: false,
      });
      return;
    }

    await onSubmit(transfer);

    this.setState({
      amount: '',
      error: '',
      loading: false,
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
              disabled={this.state.loading ? 'disabled' : ''}
            />
            {this.state.error ? (
              <p className="tiny">{this.state.error}</p>
            ) : null}

            {!this.state.loading ? (
              <button
                className="button"
                onClick={this.handleSubmit}
                disabled={this.state.loading ? 'disabled' : ''}
              >
                GIVE ME SOME GAS
              </button>
            ) : (
              <p className="tiny">
                Waiting on transaction ... Please check Metamask.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default GasTank;
