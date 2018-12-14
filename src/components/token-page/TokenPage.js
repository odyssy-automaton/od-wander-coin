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
    transactionHash: null,
    transactionReceipt: false,
    error: null,
    newToken: null,
  };
  _isMounted = false;

  componentDidMount = async () => {
    this._isMounted = true;
    this.wanderingService = new WanderingService(this.props.web3);
    const contract = await this.wanderingService.initContracts();
    const totalTokens = await this.getTotalTokens();

    if (this._isMounted) {
      this.setState({
        contract,
        totalTokens,
        wanderingService: this.wanderingService,
      });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

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
      error = { code: 9, msg: 'Cannot not be blank' };
    }

    if (error) {
      this.setState({ error, loading: false });
      throw error;
    }

    const newToken = await this.wanderingService
      .launchToken(transfer)
      .then((res) => {
        return res
          .send({ from: this.props.account })
          .once('transactionHash', (hash) => {
            this.setState({ transactionHash: hash });
            this.props.bcProcessor.setTx(
              hash,
              this.props.account,
              'Launch ' + transfer.tokenName,
            );
          })
          .then(() => {
            return this.wanderingService.totalSupply();
          })
          .catch((err) => {
            const error = { code: 11, msg: 'something went wrong. ' + err };
            this.setState({ error });
          });
      });

    if (newToken) {
      console.log('go to', newToken, this.state.transactionHash);
      this.props.bcProcessor.setTx(
        this.state.transactionHash,
        this.props.account,
        'Launch ' + transfer.tokenName,
        false,
        newToken,
      );
      this.setState({
        newToken,
      });

      //probably open a modal here instead of auto redirect
      //this.props.history.push(`/tokens/${newToken}`);
    }
    this.setState({
      loading: false,
      transactionReceipt: true,
    });
  };

  // Modal
  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false, error: null, transactionHash: null });
    if (this.state.transactionReceipt) {
      this.props.history.push(`/tokens/${this.state.newToken}`);
    }
  };

  render() {
    const { contract } = this.state;

    return (
      <TokensProvider value={this.state}>
        {this.props.account ? (
          <Modal show={this.state.show} handleClose={this.hideModal}>
            {this.state.show &&
            !this.state.transactionReceipt &&
            !this.state.transactionHash ? (
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
            ) : this.state.transactionHash && !this.state.transactionReceipt ? (
              <React.Fragment>
                <p>
                  It could take a few minutes to complete. You can check the
                  history of your transactions in the log or click the link
                  below to view the transaction. While waiting checkout out the
                  token page for to see the status of other tokens.
                </p>
                <a
                  href={'https://etherscan.io/tx/' + this.state.transactionHash}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Etherscan
                </a>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p>transaction complete.</p>
                <p>History of your transactions in the log.</p>
                <p>Click close to got to your new token.</p>
              </React.Fragment>
            )}
          </Modal>
        ) : null}
        <div className="Tokens__Container">
          <div className="Tokens__Header">
            <h3>Explore Current Tokens</h3>
            {this.props.account && (
              <button className="button" onClick={this.showModal}>
                + Launch a New Token
              </button>
            )}
          </div>
          <div className="Tokens__Explore">
            {this.state.totalTokens ? (
              <TokenList
                onLoad={this.getTotalTokens}
                onSelect={this.handleTokenSelect}
                contract={contract}
                account={this.props.account}
              />
            ) : null}
          </div>
        </div>
      </TokensProvider>
    );
  }
}

export default withRouter(TokenPage);
