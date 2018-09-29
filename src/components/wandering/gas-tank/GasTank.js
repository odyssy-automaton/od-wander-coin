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
    console.log('gas', this.state);
    console.log('props', this.props);
    const { onStart } = this.props;
    const gasBalance = await onStart();
    this.setState({ amount: gasBalance });
    console.log('gas', this.state);
  };

  handleChange = (e) => {
    this.setState({ amount: e.target.value });
  };

  handleSubmit = () => {
    const { onSubmit } = this.props;
    const transfer = { ...this.state };
    onSubmit(transfer);

    this.setState({ amount: '' });
  };

  render() {
    return (
      <div>
        <h3>GAS TANK</h3>
        <div>
          <div>
            <input
              className="Wandering__address-input"
              type="text"
              placeholder="amount"
              value={this.amount}
              onChange={this.handleChange}
            />
            <button onClick={this.handleSubmit}>GIVE ME SOME GAS</button>
          </div>
        </div>
      </div>
    );
  }
}

export default GasTank;
