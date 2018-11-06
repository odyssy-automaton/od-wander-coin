import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { getWeb3, browserObject, BrowserInfo, Web3Info } from './utils/getWeb3';
import Routes from './Routes';
import { AccountProvider } from './contexts/AccountContext';
import Header from './components/shared/header';

import './App.scss';

class App extends Component {
  state = {
    accounts: null,
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      browserObject.browser = new BrowserInfo();
      browserObject.web3Provider = new Web3Info(web3);
      console.log(browserObject);
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
