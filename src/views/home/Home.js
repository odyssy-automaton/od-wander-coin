import React, { Component } from 'react';
import WanderingToken from '../../components/wandering';
import { BcProcessorConsumer } from '../../contexts/BcProcessorContext';

class Home extends Component {
  render() {
    const { tokenId } = this.props.match.params;

    return (
      <BcProcessorConsumer>
        {(bcContext) => (
          <WanderingToken
            web3={bcContext.web3}
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
