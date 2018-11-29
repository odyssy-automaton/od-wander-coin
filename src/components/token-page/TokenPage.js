import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import WanderingService from '../../utils/WanderingWeb3';
import TokenList from './TokenList';
import TokenLaunch from './TokenLaunch';
import { TokensProvider } from '../../contexts/TokensContext';

class TokenPage extends Component {
  state = {
    contract: null,
    totalTokens: null,
    wanderingService: null,
  };

  componentDidMount = async () => {
    this.wanderingService = new WanderingService(this.props.web3);
    const contract = await this.wanderingService.initContracts();
    const totalTokens = await this.getTotalTokens();
    this.setState({
      contract,
      totalTokens,
      wanderingService: this.wanderingService,
    });
  };

  getTotalTokens = async () => {
    return await this.wanderingService.getTotalSupply();
  };

  handleTokenSelect = (tokenNumber) => {
    this.props.history.push(`/tokens/${tokenNumber}`);
  };

  handleSubmitLaunchForm = async (transfer) => {
    const newToken = await this.wanderingService.launchToken(
      this.props.account,
      transfer,
    );
    this.props.history.push(`/tokens/${newToken}`);
  };

  render() {
    const { contract } = this.state;

    return (
      <TokensProvider value={this.state}>
        <div>
          <h3>Explore the wandering coins</h3>
          {this.state.totalTokens ? (
            <TokenList
              onLoad={this.getTotalTokens}
              onSelect={this.handleTokenSelect}
              contract={contract}
            />
          ) : null}
          <h3>Launch a new coin</h3>
          <TokenLaunch onSubmit={this.handleSubmitLaunchForm} />
        </div>
      </TokensProvider>
    );
  }
}

export default withRouter(TokenPage);
