import React, { Component } from 'react';

import TokenPage from '../../components/token-page/TokenPage';
import { BcProcessorConsumer } from '../../contexts/BcProcessorContext';

class Tokens extends Component {
  render() {
    const { tokenId } = this.props.match.params;

    return (
      <BcProcessorConsumer>
        {(bcContext) => (
          <TokenPage
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

export default Tokens;
