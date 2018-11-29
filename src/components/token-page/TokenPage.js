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
    transfer.timestamp = new Date().getTime();
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
          <p>EXPLORE THE CURRENT TOKENS</p>
          {this.state.totalTokens ? (
            <TokenList
              onLoad={this.getTotalTokens}
              onSelect={this.handleTokenSelect}
              contract={contract}
            />
          ) : null}
          <p>OR: </p>
          <TokenLaunch onSubmit={this.handleSubmitLaunchForm} />
        </div>
      </TokensProvider>
    );
  }
}

export default withRouter(TokenPage);
