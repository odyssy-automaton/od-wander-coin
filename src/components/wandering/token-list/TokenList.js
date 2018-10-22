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

  handleSelect = (tokenNum) => {
    console.log('event?', tokenNum);

    const { onSelect } = this.props;
    onSelect(tokenNum);
  };

  render() {
    return (
      <div>
        <h3>Token List {this.state.totalTokens}</h3>
        <select onChange={this.handleSelect} value={1}>
          {[...Array(+this.state.totalTokens).keys()].map((i) => {
            return (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            );
          })}
          ;
        </select>
      </div>
    );
  }
}

export default TokenList;
