import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ClientInfo } from './utils/getWeb3';
import Routes from './Routes';
import { ClientInfoProvider } from './contexts/ClientInfoContext';
import Header from './components/shared/header';

import './App.scss';

class App extends Component {
  state = {
    accounts: null,
    browserInfo: null,
    web3Info: null,
    network: null,
  };

  componentDidMount = async () => {
    try {
      const clientInfo = new ClientInfo();
      await clientInfo.web3Info.init();
      const browserInfo = clientInfo.browserInfo;
      const web3Info = clientInfo.web3Info;
      const web3 = clientInfo.web3Info.web3;
      const accounts = clientInfo.web3Info.accounts;
      const network = clientInfo.web3Info.networkType;
      const env = clientInfo.web3Info.env;

      this.setState({
        accounts,
        web3,
        browserInfo,
        web3Info,
        network,
        env,
      });
    } catch (error) {
      const web3 = 'not installed';
      this.setState({
        web3,
      });
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.log(error);
    }
  };

  render() {
    const { accounts, network, web3, env } = this.state;

    return (
      <div>
        <ClientInfoProvider value={this.state}>
          <BrowserRouter>
            <Fragment>
              <Header />
              {web3 &&
              accounts &&
              ((env === 'development' && network === 'private') ||
                env === 'production') ? (
                <div>
                  <Routes />
                </div>
              ) : !web3 && !accounts && !network ? (
                <div>
                  <h2>Loading</h2>
                </div>
              ) : web3 === 'not installed' ? (
                <div>
                  <h2>Whoops! no web3.</h2>
                </div>
              ) : !accounts ? (
                <div>
                  <h2>Whoops! Hook up a wallet.</h2>
                </div>
              ) : (
                <div>
                  <h2>
                    Whoops! looks like you are devloping locally. Are you on a
                    private test rpc?
                  </h2>
                </div>
              )}
            </Fragment>
          </BrowserRouter>
        </ClientInfoProvider>
      </div>
    );
  }
}

export default App;
