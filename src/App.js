import React, { Component } from 'react';

import getWeb3 from './utils/getWeb3';
import WanderingToken from './components/wandering';
import Header from './components/shared/header';

import './App.css';

class App extends Component {
  state = {
    web3: null,
    accounts: null,
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      this.setState({ web3, accounts });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.log(error);
    }
  };

  render() {
    const { web3, accounts } = this.state;

    return (
      <div>
        <Header web3={web3} />

        {accounts && (
          <div>
            <WanderingToken account={accounts[0]} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
