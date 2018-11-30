import React, { Component } from 'react';

import WanderingService from '../../utils/WanderingWeb3';
import WanderingNew from './WanderingNew';
import WanderingMapContainer from './WanderingMapContainer';
import GasTank from './gas-tank/GasTank';

import { WanderInfoProvider } from '../../contexts/WanderInfoContext';
import Modal from '../shared/modal/Modal';

import { totalDistance } from '../../utils/distanceHelpers';

import './Wandering.scss';
import icon from '../../assets/wander-coin.png';

class Wandering extends Component {
  state = {
    contract: null,
    longitude: null,
    latitude: null,
    owner: null,
    coordinates: [],
    error: null,
    loading: false,
    showSuccessModal: false,
    txMeta: null,
    tokenMeta: null,
    totalDistance: null,
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

    if (hasOwned) {
      this.setState({
        error: {
          code: 5,
          msg: 'Receiving Address has already owned this token.',
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

    const tx = await this.wanderingService.sendTo(
      this.props.account,
      toAddress,
      this.props.tokenId,
      transfer,
    );

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

      this.setState({
        error: null,
        coordinates,
        owner: toAddress,
        loading: false,
        showSuccessModal: true,
      });
    }
  };

  handleSubmitGasForm = async (amount) => {
    const amountInWei = await this.wanderingService.toWei(amount.amount);
    return this.wanderingService.sendTransaction(
      this.props.account,
      amountInWei,
    );
  };

  hideModal = () => {
    this.setState({ showSuccessModal: false });
  };

  render() {
    const {
      contract,
      owner,
      coordinates,
      tokenMeta,
      totalDistance,
    } = this.state;
    const isOwner = owner === this.props.account;

    return !contract ? (
      <h3>Loading contract</h3>
    ) : (
      <WanderInfoProvider value={this.state}>
        <div className="Wandering">
          <Modal
            show={this.state.showSuccessModal}
            handleClose={this.hideModal}
          >
            <h3>Successfully sent token</h3>
          </Modal>
          <div className="Wandering__bar">
            <div className="contents">
              <p>What is this?</p>
              <p>
                Wander Coin is an experimental DApp and token model where there
                is a supply of one non-fungible token to test various game
                theories. The goal is to get the coin all the way around the
                world without touching the same wallet.
              </p>
              <a className="button od-primary" href="/">
                Read More
              </a>
            </div>
          </div>
          <div className="Wandering__container">
            <div className="sidenav">
              <div className="Wandering__transfer">
                <div className="Wandering__form">
                  {!isOwner ? (
                    <div>
                      {tokenMeta ? (
                        <div>
                          <h2>The {tokenMeta.name} be wandering ...</h2>
                          <p className="tiny">
                            If you think you have it, make sure you’re on the
                            Main Ethereum Network and connected to the wallet
                            that the coin was sent to.
                          </p>
                        </div>
                      ) : (
                        <h2>Loading...</h2>
                      )}
                    </div>
                  ) : (
                    <div>
                      <img
                        alt="wander-coin icon"
                        src={tokenMeta.image || icon}
                        width="100px"
                        height="100px"
                      />
                      {tokenMeta ? (
                        <div>
                          <h2>The {tokenMeta.name} is in your wallet!</h2>
                          <p className="tiny">
                            It's purpose is {tokenMeta.description}
                          </p>
                          <p className="tiny">
                            Distance traveled so far: {totalDistance} miles
                          </p>
                        </div>
                      ) : null}

                      <WanderingNew
                        loading={this.state.loading}
                        onSubmit={this.handleSubmitAddressForm}
                      />
                      {this.state.error ? (
                        <p className="tiny">{this.state.error.msg}</p>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
              <div className="Wandering__gas">
                <GasTank
                  onSubmit={this.handleSubmitGasForm}
                  onLoad={this.getBalance}
                />
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
