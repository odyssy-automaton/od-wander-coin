import React, { Component } from 'react';

import WanderingService from '../../utils/WanderingWeb3';
import TokenList from './token-list/TokenList';
import { withRouter } from 'react-router-dom';

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
    console.log('handleTokenSelect', this.props);

    this.props.history.push(`/tokens/${tokenNumber}`);
  };

  render() {
    return (
      <div>
        {this.state.totalTokens ? (
          <TokenList
            onLoad={this.getTotalTokens}
            onSelect={this.handleTokenSelect}
          />
        ) : null}
      </div>
    );
  }
}

export default withRouter(TokenPage);
