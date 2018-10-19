import React, { Component } from 'react';

import getWeb3 from './utils/getWeb3';
import WanderingToken from './components/wandering';
import Header from './components/shared/header';

import './App.css';

class App extends Component {
  state = {
    web3: null,
    accounts: null,
    tokenId: null,
  };

  componentDidMount = async () => {
    const tokenId = parseInt(window.location.pathname.split('/')[1], 10) || 1;

    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      this.setState({ web3, accounts, tokenId });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.log(error);
    }
  };

  render() {
    const { accounts, tokenId } = this.state;

    return (
      <div>
        <Header />

        {accounts ? (
          <div>
            <WanderingToken account={accounts[0]} tokenId={tokenId} />
          </div>
        ) : (
          <div>
            <h2>Whoops! I can't find a wallet.</h2>
          </div>
        )}
      </div>
    );
  }
}

export default App;
