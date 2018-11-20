import React, { Component } from 'react';
import { ClientInfoConsumer } from '../../contexts/ClientInfoContext';
import TokenPage from '../../components/token-page/TokenPage';

class Tokens extends Component {
  render() {
    const { tokenId } = this.props.match.params;

    return (
      <ClientInfoConsumer>
        {(context) => (
          <TokenPage
            web3={context.web3}
            account={context.accounts[0]}
            tokenId={tokenId}
          />
        )}
      </ClientInfoConsumer>
    );
  }
}

export default Tokens;
