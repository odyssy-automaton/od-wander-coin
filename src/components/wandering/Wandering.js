import React, { Component } from 'react';

import WanderingService from '../../utils/WanderingWeb3';
import WanderingNew from './WanderingNew';
import WanderingLaunch from './WanderingLaunch';
import WanderingMapContainer from './WanderingMapContainer';
import GasTank from './gas-tank/GasTank';
import TokenList from './token-list/TokenList';

import './Wandering.css';

class Wandering extends Component {
  state = {
    contract: null,
    longitude: null,
    latitude: null,
    owner: null,
    coordinates: [],
    totalTokens: null,
  };

  componentDidMount() {
    this.wanderingService = new WanderingService();
    this.loadContract();
  }

  loadContract = async () => {
    const contract = await this.wanderingService.initContracts();
    const totalTokens = await this.getTotalTokens();
    this.setState({ contract, totalTokens });
    this.getOwner();
  };

  getTotalTokens = async () => {
    return await this.wanderingService.getTotalSupply();
  };

  handleTokenSelect = (tokenNumber) => {
    console.log('handleTokenSelect', tokenNumber);
    window.location = `${window.location.origin}/${tokenNumber}`;
  };

  getOwner = async () => {
    const owner = await this.wanderingService.getOwner(this.props.tokenId);
    const coords = await this.wanderingService.getAllOwnerCords(
      this.props.tokenId,
    );
    const coordinates = [...this.state.coordinates, ...coords];
    this.setState({ owner, coordinates });
  };

  handleSubmitAddressForm = async (transfer) => {
    await this.wanderingService.sendTo(
      this.props.account,
      transfer.toAddress,
      transfer.latitude,
      transfer.longitude,
      this.props.tokenId,
    );

    const coordinates = [
      ...this.state.coordinates,
      { lat: transfer.latitude, lng: transfer.longitude },
    ];

    this.setState({ coordinates });
  };

  handleSubmitLaunchForm = async (transfer) => {
    const newToken = await this.wanderingService.launchToken(
      this.props.account,
      transfer.latitude,
      transfer.longitude,
    );

    console.log('new token is:', newToken);
  };

  handleSubmitGasForm = async (amount) => {
    const amountInWei = await this.wanderingService.toWei(amount.amount);
    await this.wanderingService.sendTransaction(
      this.props.account,
      amountInWei,
    );
  };

  getBalance = async () => {
    const balance = await this.wanderingService.balanceOfTank();
    return this.wanderingService.toEth(balance);
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
            <p>Wander Coin is an experimental DApp and token model where there is a supply of one non-fungible token to test various game theories.</p>
            <a className="button od-primary">Read More</a>
          </div>
        </div>
        <div className="Wandering__container">
          <div className="sidenav">
            <div className="Wandering__transfer">
              <div className="Wandering__form">
                {!isOwner ? (
                  <div>
                    <h2>Wander Coin be wandering ... </h2>
                    <p className="tiny">If you think you have it, make sure you’re on the Main Ethereum Network and connected to the wallet that the coin was sent to.</p>
                    <WanderingLaunch onSubmit={this.handleSubmitLaunchForm} />
                  </div>

                ) : (
                  <div>
                    <h2>You're holding the Wander Coin!</h2>
                    <WanderingNew onSubmit={this.handleSubmitAddressForm} />
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

        <div className="Wandering__info">
          <div>
            <h3 className="Wandering__token-id">
              Token # {this.props.tokenId} of {this.state.totalTokens} total
            </h3>
            <p>
              Navigate to token by changing the number in the path example:
              <a href="/2"> #2</a>
            </p>
            <TokenList
              onSelect={this.handleTokenSelect}
              onLoad={this.getTotalTokens}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Wandering;
