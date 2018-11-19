import React, { Component } from 'react';

import { ClientInfoConsumer } from '../../contexts/ClientInfoContext';
import WanderingToken from '../../components/wandering';

class Home extends Component {
  render() {
    const { tokenId } = this.props.match.params;

    return (
      <ClientInfoConsumer>
        {(context) => (
          <WanderingToken
            web3={context.web3}
            account={context.accounts[0]}
            tokenId={tokenId}
          />
        )}
      </ClientInfoConsumer>
    );
  }
}

export default Home;
