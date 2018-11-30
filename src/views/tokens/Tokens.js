import React, { Component } from 'react';
import Web3 from 'web3';
import { Web3Consumer } from 'web3-react';

import TokenPage from '../../components/token-page/TokenPage';

class Tokens extends Component {
  render() {
    const { tokenId } = this.props.match.params;

    return (
      <Web3Consumer>
        {(context) => (
          <TokenPage
            web3={new Web3(context.web3js.givenProvider)} // force .34 version of web3
            account={context.account}
            tokenId={tokenId}
          />
        )}
      </Web3Consumer>
    );
  }
}

export default Tokens;
