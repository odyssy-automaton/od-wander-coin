import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import GradientSVG from '../../../components/shared/gradient-svg/GradientSVG.js'

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
  };

  render() {
    // Set percentage
    const percentage = (this.state.balance * 100);
    return (
      <div className="GasTank">
        <div className="GasTank__gas">
          <GradientSVG
            startColor='#F88073'
            endColor='#5f5fff'
            rotation='90'
            idCSS='gas'
          />
          <CircularProgressbar
            className="GasTank__bar"
            percentage={percentage}
            text={`${this.state.balance} ETH`}
            styles={{
              text: { fill: '#f88', fontSize: '16px' },
            }}
          />
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
