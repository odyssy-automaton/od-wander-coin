import React, { Component } from 'react';

class TokenList extends Component {
  state = {
    totalTokens: '',
  };

  componentDidMount() {
    this.getTotalTokens();
  }

  getTotalTokens = async () => {
    const { onLoad } = this.props;
    const totalTokens = await onLoad();
    this.setState({ totalTokens });
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
      <div>
        <h3>Token List {this.state.totalTokens}</h3>
        <select>
          {[...Array(this.state.totalTokens).keys()].map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
          ;
        </select>
      </div>
    );
  }
}

export default TokenList;
