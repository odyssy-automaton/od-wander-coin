import React, { Component } from 'react';

import WanderingService from '../../utils/WanderingWeb3';
import WanderingNew from './WanderingNew';
import WanderingMapContainer from './WanderingMapContainer';
import GasTank from './gas-tank/GasTank';

import './Wandering.css';

class Wandering extends Component {
  state = {
    contract: null,
    longitude: null,
    latitude: null,
    owner: null,
    coordinates: [],
  };

  componentDidMount() {
    this.wanderingService = new WanderingService();
    this.loadContract();
  }

  loadContract = async () => {
    const contract = await this.wanderingService.initContracts();
    this.setState({ contract });
    this.getOwner();
  };

  getOwner = async () => {
    const owner = await this.wanderingService.getOwner();
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
        <div className="Wandering__info">
          <div>
            <h3 className="Wandering__token-id">
              Token # {this.props.tokenId}
            </h3>
          </div>
          <div>
            <GasTank
              onSubmit={this.handleSubmitGasForm}
              onLoad={this.getBalance}
            />
          </div>
        </div>
        <div className="Wandering__transfer">
          <div className="Wandering__form">
            {!isOwner ? (
              <h3>YOU DON'T OWN ME</h3>
            ) : (
              <WanderingNew onSubmit={this.handleSubmitAddressForm} />
            )}
          </div>
          <div>
            <WanderingMapContainer coordinates={coordinates} />
          </div>
        </div>
      </div>
    );
  }
}

export default Wandering;
