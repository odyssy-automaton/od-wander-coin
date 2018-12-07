import React, { Component } from 'react';
import Web3 from 'web3';
import WanderingToken from '../../components/wandering';
import { Web3Consumer } from 'web3-react';
import { BcProcessorConsumer } from '../../contexts/BcProcessorContext';

class Home extends Component {
  render() {
    const { tokenId } = this.props.match.params;

    return (
      <BcProcessorConsumer>
        {(bcContext) => (
          <WanderingToken
            web3={bcContext.web3} // force .34 version of web3
            account={bcContext.account}
            tokenId={tokenId}
            bcProcessor={bcContext}
          />
        )}
      </BcProcessorConsumer>
    );
  }
}

export default Home;
