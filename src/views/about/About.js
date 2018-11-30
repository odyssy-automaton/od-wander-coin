import React, { Component } from 'react';

class About extends Component {
  state = {
    contractAddr: process.env.REACT_APP_CONTRACT_ADDRESS,
  };
  render() {
    return (
      <div>
        <h2>About</h2>
        <p>Rinkeby contract address {this.state.contractAddr}</p>
      </div>
    );
  }
}

export default About;
