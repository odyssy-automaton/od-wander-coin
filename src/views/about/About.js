import React, { Component } from 'react';

class About extends Component {
  state = {
    contractAddr: process.env.REACT_APP_CONTRACT_ADDRESS,
  };
  render() {
    return (
<<<<<<< HEAD
      <div className="Container--Standard">
        <div className="contents">
          <h2>About Wander Coin</h2>
          <p>Wander Coin is an experimental DApp and token model where there is a supply of one non-fungible token to test various game theories. The goal is to get the coin all the way around the world without touching the same wallet.</p>
        </div>
=======
      <div>
        <h2>About</h2>
        <p>Rinkeby contract address {this.state.contractAddr}</p>
>>>>>>> ddf7eb2256f174c74e971e51988d6842bb200544
      </div>
    );
  }
}

export default About;
