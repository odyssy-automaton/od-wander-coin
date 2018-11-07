import React, { Component } from 'react';

import { AccountConsumer } from '../../contexts/AccountContext';
import WanderingToken from '../../components/wandering';

class Home extends Component {
  render() {
    const { tokenId } = this.props.match.params;

    return (
      <AccountConsumer>
        {(context) => (
          <WanderingToken
            web3={context.web3}
            account={context.accounts[0]}
            tokenId={tokenId}
          />
        )}
      </AccountConsumer>
    );
  }
}

export default Home;
