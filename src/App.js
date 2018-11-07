import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ClientInfo } from './utils/getWeb3';
import Routes from './Routes';
import { AccountProvider } from './contexts/AccountContext';
import Header from './components/shared/header';

import './App.scss';

class App extends Component {
  state = {
    accounts: null,
    browserInfo: {},
    web3Info: {},
  };

  componentDidMount = async () => {
    try {
      const clientInfo = new ClientInfo();
      await clientInfo.web3Info.init();
      const browserInfo = clientInfo.browserInfo;
      const web3Info = clientInfo.web3Info;
      const web3 = clientInfo.web3Info.web3;
      const accounts = clientInfo.web3Info.accounts;

      this.setState({
        accounts,
        web3,
        browserInfo,
        web3Info,
      });
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
