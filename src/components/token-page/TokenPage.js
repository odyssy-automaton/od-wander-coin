import React, { Component } from 'react';

import WanderingService from '../../utils/WanderingWeb3';
import TokenList from './token-list/TokenList';

class TokenPage extends Component {
  state = {
    contract: null,
    owner: null,
    totalTokens: null,
  };

  componentDidMount() {
    this.wanderingService = new WanderingService(this.props.web3);
    this.loadContract();
  }

  loadContract = async () => {
    const contract = await this.wanderingService.initContracts();
    const totalTokens = await this.getTotalTokens();
    this.setState({ contract, totalTokens });
  };

  getTotalTokens = async () => {
    return await this.wanderingService.getTotalSupply();
  };

  handleTokenSelect = (tokenNumber) => {
    console.log('handleTokenSelect', tokenNumber);
    window.location = `${window.location.origin}/${tokenNumber}`;
  };

  render() {
    return (
      <div>
        <h3>contract {this.state.totalTokens}</h3>
        <TokenList
          onLoad={this.getTotalTokens}
          onSelect={this.handleTokenSelect}
        />
      </div>
    );
  }
}

export default TokenPage;
