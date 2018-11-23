import React, { Component } from 'react';

import WanderingService from '../../utils/WanderingWeb3';
import WanderingNew from './WanderingNew';
import WanderingMapContainer from './WanderingMapContainer';
import GasTank from './gas-tank/GasTank';

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
  };

  componentDidMount() {
    this.wanderingService = new WanderingService(this.props.web3);
    this.loadContract();
  }

  loadContract = async () => {
    const contract = await this.wanderingService.initContracts();
    this.setState({ contract });
    this.getOwner();
  };

  getOwner = async () => {
    const owner = await this.wanderingService.getOwner(this.props.tokenId);
    const coords = await this.wanderingService.getAllOwnerCords(
      this.props.tokenId,
    );
    const coordinates = [...this.state.coordinates, ...coords];
    this.setState({ owner, coordinates });
  };

  getBalance = async () => {
    const balance = await this.wanderingService.balanceOfTank();
    return this.wanderingService.toEth(balance);
  };

  handleSubmitAddressForm = async (transfer) => {
    this.setState({ loading: true });
    const gasTank = await this.getBalance();

    // if user decides to send it anyways on second press
    if (this.state.error && this.state.error.code === 4) {
      this.setState({
        skipError: true,
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
      transfer.toAddress,
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

    if (this.props.account === transfer.toAddress) {
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
      transfer.toAddress,
      transfer.latitude,
      transfer.longitude,
      transfer.streetAddress,
      transfer.journal,
      this.props.tokenId,
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
        },
      ];

      this.setState({
        error: null,
        coordinates,
        owner: transfer.toAddress,
        loading: false,
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

  render() {
    const { contract, owner, coordinates } = this.state;
    const isOwner = owner === this.props.account;

    return !contract ? (
      <h3>Loading contract</h3>
    ) : (
      <div className="Wandering">
        <div className="Wandering__bar">
          <div className="contents">
            <p>What is this?</p>
            <p>
              Wander Coin is an experimental DApp and token model where there is
              a supply of one non-fungible token to test various game theories.
              The goal is to get the coin all the way around the world without
              touching the same wallet.
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
                    <h2>Wander Coin be wandering ... </h2>
                    <p className="tiny">
                      If you think you have it, make sure you’re on the Main
                      Ethereum Network and connected to the wallet that the coin
                      was sent to.
                    </p>
                  </div>
                ) : (
                  <div>
                    <img
                      alt="wander-coin icon"
                      src={icon}
                      width="100px"
                      height="100px"
                    />
                    <h2>The Wander Coin is in your wallet!</h2>
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
    );
  }
}

export default Wandering;
