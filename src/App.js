import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

import getWeb3 from './utils/getWeb3';
import Routes from './Routes';
import { AccountProvider } from './contexts/AccountContext';
import Header from './components/shared/header';

import './App.scss';

class App extends Component {
  state = {
    accounts: null,
    // tokenId: null,
  };

  componentDidMount = async () => {
    // const tokenId = parseInt(window.location.pathname.split('/')[1], 10) || 1;

    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      this.setState({ accounts });
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.log(error);
    }
  };

  render() {
    const { accounts } = this.state;

    return (
      <div>
        <AccountProvider value={this.state}>
          <BrowserRouter>
            <Fragment>
              <Header />
              {accounts ? (
                <div>
                  <Routes />
                </div>
              ) : (
                <div>
                  <h2>Whoops! Hook up a wallet.</h2>
                </div>
              )}
            </Fragment>
          </BrowserRouter>
        </AccountProvider>
      </div>
    );
  }
}

export default App;
