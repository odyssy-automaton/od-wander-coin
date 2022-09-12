import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import WanderingService from '../../utils/WanderingWeb3';

import WanderingNew from './WanderingNew';
import WanderingMapContainer from './WanderingMapContainer';

import { WanderInfoProvider } from '../../contexts/WanderInfoContext';
import Modal from '../shared/modal/Modal';

import { totalDistance } from '../../utils/distanceHelpers';

import './Wandering.scss';
import icon from '../../assets/wander-coin.png';
import TokenIcon from '../shared/token-icon';

class Wandering extends Component {
  state = {
    contract: null,
    longitude: null,
    latitude: null,
    owner: null,
    coordinates: [],
    error: null,
    loading: false,
    transactionReceipt: false,
    txMeta: null,
    tokenMeta: null,
    totalDistance: null,
    transactionHash: null,
  };
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

    this.wanderingService = new WanderingService(this.props.web3);
    this.loadContract();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadContract = async () => {
    const contract = await this.wanderingService.initContracts();
    if (this._isMounted) {
      this.setState({ contract });
    }
    this.getOwnerAndMeta();
  };

  getOwnerAndMeta = async () => {
    const owner = await this.wanderingService.getOwner(this.props.tokenId);
    const coords = await this.wanderingService.getAllOwnerCords(
      this.props.tokenId,
    );

    const coordinates = [...this.state.coordinates, ...coords];

    const tokenMeta = await this.wanderingService.getTokenMetaData(
      this.props.tokenId,
    );
    if (this._isMounted) {
      this.setState({
        tokenMeta,
        owner,
        coordinates,
        totalDistance: totalDistance(coords),
      });
    }
  };

  getBalance = async () => {
    const balance = await this.wanderingService.balanceOfTank();
    return this.wanderingService.toEth(balance);
  };

  handleSubmitAddressForm = async (toAddress, transfer) => {
    this.setState({ loading: true });
    const gasTank = await this.getBalance();
    transfer.timestamp = new Date().getTime();

    // if user decides to send it anyways on second press
    if (this.state.error && this.state.error.code === 4) {
      this.setState({
        skipError: true,
      });
    } else {
      this.setState({
        error: false,
      });
    }

    // add to config
    if (gasTank < 0.002) {
      this.setState({
        error: {
          code: 4,
          msg:
            'Not enough gas in the tank. You will not forward any gas to the receiver. If that is ok you can press the send button again.',
        },
      });
    }

    const hasOwned = await this.wanderingService.addrHasOwned(
      toAddress,
      this.props.tokenId,
    );

    if (hasOwned === 'bad addr') {
      this.setState({
        error: {
          code: 6,
          msg: 'Receiving Address is not valid.',
        },
      });
    } else if (hasOwned) {
      this.setState({
        error: {
          code: 5,
          msg: 'Receiving wallet address has already owned this token.',
        },
      });
    }

    if (this.props.account === toAddress) {
      this.setState({ error: { code: 3, msg: 'Cant send to self' } });
    }

    if (
      transfer.latitude <= -180 ||
      transfer.latitude >= 180 ||
      (transfer.latitude <= -90 || transfer.latitude >= 90)
    ) {
      this.setState({ error: { code: 2, msg: 'invalid location' } });
    }

    if (this.state.error && !this.state.skipError) {
      this.setState({ loading: false });
      throw this.state.error;
    }

    console.log(this.props.account, toAddress, this.props.tokenId, transfer);
    let transactionHash = null; //local
    const tx = await this.wanderingService
      .sendTo(this.props.account, toAddress, this.props.tokenId, transfer)
      .then((res) => {
        return res
          .send({ from: this.props.account })
          .once('transactionHash', (hash) => {
            this.setState({ transactionHash: hash });
            transactionHash = hash;
            this.props.bcProcessor.setTx(
              hash,
              this.props.account,
              'Send ' + this.state.tokenMeta.name,
              true,
              this.props.tokenId,
            );
          })
          .then((res) => {
            return res;
          })
          .catch((err) => {
            console.log(err);
          });
      });

    if (!tx) {
      this.setState({
        error: { code: 1, msg: 'user rejected' },
        loading: false,
      });
      throw this.state.error;
    } else {
      const coordinates = [
        ...this.state.coordinates,
        {
          lat: transfer.latitude,
          lng: transfer.longitude,
          streetAddress: transfer.streetAddress,
          journal: transfer.journal,
          timestamp: transfer.timestamp,
        },
      ];
      this.props.bcProcessor.setTx(
        transactionHash, // this is not getting set
        this.props.account,
        'Send ' + this.state.tokenMeta.name,
        false,
        this.props.tokenId,
      );

      this.setState({
        error: null,
        coordinates,
        owner: toAddress,
        loading: false,
        transactionReceipt: true,
      });
    }
  };

  hideModal = () => {
    this.setState({ transactionHash: null });
  };

  render() {
    const {
      contract,
      owner,
      coordinates,
      tokenMeta,
      totalDistance,
      mph,
    } = this.state;
    const isOwner = owner === this.props.account;

    return !contract ? (
      <h3>Loading contract</h3>
    ) : (
      <WanderInfoProvider value={this.state}>
        <div className="Wandering">
          <Modal show={this.state.transactionHash} handleClose={this.hideModal}>
            <h3>Transaction has Started.</h3>
            {this.state.transactionReceipt ? (
              <React.Fragment>
                <p>transaction complete.</p>
                <p>History of your transactions in the log.</p>
              </React.Fragment>
            ) : (
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
            )}
          </Modal>

          <div className="Wandering__container">
            <div className="sidenav">
              {tokenMeta && (
                <div className="Wandering__info">
                  <div
                    className="Wandering__info--bar"
                    style={{ backgroundColor: tokenMeta.extra.color }}
                  />
                  <h2>
                    <TokenIcon
                      color={tokenMeta.extra.color}
                      id={tokenMeta.tokenId}
                      name={tokenMeta.name}
                      className="Tokens__Icon--Small"
                    />
                    {tokenMeta.name}
                  </h2>
                  <p>{tokenMeta.description}</p>
                </div>
              )}
              {tokenMeta && (
                <div className="Wandering__data">
                  <div className="Columns">
                    <div className="Columns__Column--33">
                      <h2>{coordinates.length}</h2>
                      <p className="tiny">Stops</p>
                    </div>
                    <div className="Columns__Column--33">
                      <h2>{totalDistance}</h2>
                      <p className="tiny">Miles Traveled</p>
                    </div>
                    <div className="Columns__Column--33">
                      <h2>{mph}</h2>
                      <p className="tiny">MPH</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="Wandering__transfer">
                <div className="Wandering__form">
                  {!isOwner ? (
                    <div>
                      {tokenMeta ? (
                        <div>
                          <h3>{tokenMeta.name} is wandering ...</h3>
                          <p className="tiny">
                            If you think you have it, make sure you’re on the
                            Main Ethereum Network and connected to the wallet
                            that the coin was sent to.
                          </p>
                          {!this.props.account && (
                            <div>
                              <h2>No Web3 Support</h2>
                              <p>
                                Your browser does not have Web3 capabilities.
                                Please consider installing{' '}
                                <a
                                  href="https://metamask.io/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  MetaMask
                                </a>{' '}
                                (or{' '}
                                <a
                                  href="https://trustwalletapp.com/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Trust Wallet
                                </a>{' '}
                                on mobile).
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <h2>Loading...</h2>
                      )}
                    </div>
                  ) : (
                    <div>
                      {tokenMeta ? (
                        <div>
                          <h3>{tokenMeta.name} is in your wallet!</h3>
                        </div>
                      ) : null}
                      {this.props.account && (
                        <WanderingNew
                          transactionHash={this.state.transactionHash}
                          loading={this.state.loading}
                          onSubmit={this.handleSubmitAddressForm}
                        />
                      )}

                      {this.state.error ? (
                        <p className="tiny">{this.state.error.msg}</p>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="Wandering__map">
              <WanderingMapContainer coordinates={coordinates} />
            </div>
          </div>
        </div>
      </WanderInfoProvider>
    );
  }
}

export default Wandering;
