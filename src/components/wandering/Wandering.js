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
    this.setState({ owner });
  };

  handleSubmitAddressForm = async (transfer) => {
    await this.wanderingService.sendTo(
      this.props.account,
      transfer.toAddress,
      transfer.latitude,
      transfer.longitude,
    );
  };

  handleSubmitGasForm = async (amount) => {
    await this.wanderingService.sendTransaction(
      this.props.account,
      amount.amount,
    );
  };

  render() {
    const { contract, owner } = this.state;
    const isOwner = owner === this.props.account;

    return !contract ? (
      <h3>Loading contract</h3>
    ) : (
      <div>
        <div className="Wandering">
          <div>
            <GasTank onSubmit={this.handleSubmitGasForm} />
          </div>

          {!isOwner ? (
            <h3>YOU DON'T OWN ME</h3>
          ) : (
            <div className="Wandering__form">
              <WanderingNew onSubmit={this.handleSubmitAddressForm} />
            </div>
          )}

          <div>
            <WanderingMapContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default Wandering;
