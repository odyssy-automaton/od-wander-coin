import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Web3Provider from 'web3-react';

import Routes from './Routes';
import Header from './components/shared/header';

import './App.scss';

class App extends Component {
  componentDidMount = async () => {};

  render() {
    return (
      <div>
        <Web3Provider>
          <BrowserRouter>
            <Fragment>
              <Header />
              <div>
                <Routes />
              </div>
            </Fragment>
          </BrowserRouter>
        </Web3Provider>
      </div>
    );
  }
}

export default App;
