import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import WanderingService from '../../utils/WanderingWeb3';
import TokenList from './TokenList';
import TokenLaunch from './TokenLaunch';
import { TokensProvider } from '../../contexts/TokensContext';

import Modal from '../shared/modal/Modal';

class TokenPage extends Component {
  state = {
    contract: null,
    totalTokens: null,
    wanderingService: null,
    show: false, // modal,
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

  // Modal
  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  render() {
    const { contract } = this.state;

    return (
      <TokensProvider value={this.state}>
<<<<<<< HEAD
        <Modal show={this.state.show} handleClose={this.hideModal}>
          {this.state.show ? (
            <div>
              <TokenLaunch onSubmit={this.handleSubmitLaunchForm} />
            </div>
          ) : null}
        </Modal>
        <div className="Tokens__Container">
          <div className="Tokens__Header">
          <h3>Explore Current Tokens</h3>
          <button className="button" onClick={this.showModal}>+ Launch a New Token</button>
          </div>
          <div className="Tokens__Explore">
            {this.state.totalTokens ? (
              <TokenList
                onLoad={this.getTotalTokens}
                onSelect={this.handleTokenSelect}
                contract={contract}
              />
            ) : null}
          </div>
=======
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
>>>>>>> 2ce17f7fa6dc8f80dfc2a94e22161037ea6e2e8f
        </div>
      </TokensProvider>
    );
  }
}

export default withRouter(TokenPage);
