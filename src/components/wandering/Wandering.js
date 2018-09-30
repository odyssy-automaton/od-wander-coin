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
    const coords = await this.wanderingService.getCoordinates(owner);
    const coordinates = [...this.state.coordinates, coords];
    console.log(coordinates);
    this.setState({ owner, coordinates });
  };

  handleSubmitAddressForm = async (transfer) => {
    await this.wanderingService.sendTo(
      this.props.account,
      transfer.toAddress,
      transfer.latitude,
      transfer.longitude,
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
    console.log('balance', balance);
    this.getAllOwnerCoords();
    return this.wanderingService.toEth(balance);
  };

  getAllOwnerCoords = async () => {
    console.log('cords', await this.wanderingService.getAllOwnerCords());
  };

  render() {
    const { contract, owner, coordinates } = this.state;
    const isOwner = owner === this.props.account;

    return !contract ? (
      <h3>Loading contract</h3>
    ) : (
      <div>
        <div className="Wandering">
          <div>
            <GasTank
              onSubmit={this.handleSubmitGasForm}
              onLoad={this.getBalance}
            />
          </div>

          {!isOwner ? (
            <h3>YOU DON'T OWN ME</h3>
          ) : (
            <div className="Wandering__form">
              <WanderingNew onSubmit={this.handleSubmitAddressForm} />
            </div>
          )}

          <div>
            <WanderingMapContainer coordinates={coordinates} />
          </div>
        </div>
      </div>
    );
  }
}

export default Wandering;
