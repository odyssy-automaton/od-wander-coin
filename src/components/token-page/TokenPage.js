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
    loading: false,
    transactionHash: '',
    error: null,
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
    let error;
    this.setState({
      loading: true,
    });

    if (
      transfer.journal === '' ||
      transfer.tokenName === '' ||
      transfer.tokenColor === ''
    ) {
      error = { code: 9, msg: 'Cant not be blank' };
    }

    if (error) {
      this.setState({ error, loading: false });
      throw error;
    }

    const newToken = await this.wanderingService.launchToken(
      this.props.account,
      transfer,
    );
    if (newToken) {
      console.log(newToken);

      this.props.history.push(`/tokens/${newToken}`);
    }
    this.setState({
      loading: false,
    });
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
        <Modal show={this.state.show} handleClose={this.hideModal}>
          {this.state.show ? (
            <div>
              <TokenLaunch
                loading={this.state.loading}
                transactionHash={this.state.transactionHash}
                onSubmit={this.handleSubmitLaunchForm}
              />
              {this.state.error ? (
                <p className="tiny">{this.state.error.msg}</p>
              ) : null}
            </div>
          ) : null}
        </Modal>
        <div className="Tokens__Container">
          <div className="Tokens__Header">
            <h3>Explore Current Tokens</h3>
            <button className="button" onClick={this.showModal}>
              + Launch a New Token
            </button>
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
        </div>
      </TokensProvider>
    );
  }
}

export default withRouter(TokenPage);
