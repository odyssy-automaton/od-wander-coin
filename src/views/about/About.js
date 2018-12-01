import React, { Component } from 'react';

class About extends Component {
  state = {
    contractAddr: process.env.REACT_APP_CONTRACT_ADDRESS,
  };
  render() {
    return (
      <div className="Container--Standard">
        <div className="contents">
          <h2>About Wander Coin</h2>
          <p>
            Wander Coin is an experimental DApp and token model where there is a
            supply of one non-fungible token to test various game theories. The
            goal is to get the coin all the way around the world without
            touching the same wallet.
          </p>
          <p>Rinkeby contract address {this.state.contractAddr}</p>
        </div>
      </div>
    );
  }
}

export default About;
