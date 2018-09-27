import React, { Component } from 'react';

import WanderingService from '../../utils/WanderingWeb3';
import WanderingNew from './WanderingNew';
import WanderingMapContainer from './WanderingMapContainer';

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

    console.log(contract);
    this.setState({ contract });

    this.loadAccountData();
  };

  loadAccountData = async () => {
    const owner = await this.wanderingService.owner();
    this.setState({ owner });
  };

  handleSubmitAddressForm = (address) => {
    console.log('submitting ' + address);
  };

  render() {
    const { contract } = this.state;

    return !contract ? (
      <h3>Loading contract</h3>
    ) : (
      <div>
        <div className="Wandering">
          <div className="Wandering__form">
            <WanderingNew onSubmit={this.handleSubmitAddressForm} />
          </div>
          <div>
            <WanderingMapContainer />
          </div>
        </div>
      </div>
    );
  }
}

export default Wandering;
