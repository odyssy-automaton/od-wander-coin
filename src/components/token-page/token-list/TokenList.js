import React, { Component } from 'react';

class TokenList extends Component {
  state = {
    totalTokens: '',
    tokenNumber: '',
  };

  componentDidMount() {
    this.getTotalTokens();
  }

  getTotalTokens = async () => {
    const { onLoad } = this.props;
    const totalTokens = await onLoad();
    this.setState({ totalTokens });
  };

  handleSelect = (event) => {
    event.persist();

    const { onSelect } = this.props;
    this.setState({ tokenNumber: event.target.value }, () => {
      onSelect(this.state.tokenNumber);
    });
  };

  render() {
    return (
      <div>
        <h3>Token List: {this.state.totalTokens} total</h3>
        <form>
          <select onChange={this.handleSelect} value={this.state.tokenNumber}>
            {[...Array(+this.state.totalTokens).keys()].map((i) => {
              return (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              );
            })}
          </select>
        </form>
      </div>
    );
  }
}

export default TokenList;
