import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Web3Provider, { Web3Consumer } from 'web3-react';
import { Helmet } from 'react-helmet';

import Routes from './Routes';
import Header from './components/shared/header';

import './App.scss';
import BcProcessorProvider from './contexts/BcProcessorContext';
import Web3 from 'web3';

import screens from './defaultScreens';

class App extends Component {
  // move to env config
  networks = [4];
  theweb3 = null;

  componentDidMount = async () => {};

  newWeb3 = (provider) => {
    if (this.theweb3 === null) {
      this.theweb3 = new Web3(provider);
    }
    return this.theweb3;
  };

  render() {
    if (process.env.NODE_ENV === 'development') {
      this.networks = [1, 3, 4, 42, 4447];
    }
    return (
      <div>
        <Helmet />
        <Web3Provider screens={screens} supportedNetworks={this.networks}>
          <BrowserRouter>
            <Web3Consumer>
              {(context) => (
                <BcProcessorProvider
                  web3={this.newWeb3(context.web3js.givenProvider)}
                  account={context.account}
                >
                  <Fragment>
                    <Header
                      web3={this.newWeb3(context.web3js.givenProvider)}
                      account={context.account}
                    />
                    <div>
                      <Routes />
                    </div>
                  </Fragment>
                </BcProcessorProvider>
              )}
            </Web3Consumer>
          </BrowserRouter>
        </Web3Provider>
      </div>
    );
  }
}

export default App;
