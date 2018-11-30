import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Web3Provider from 'web3-react';
import { Helmet } from 'react-helmet';

import Routes from './Routes';
import Header from './components/shared/header';

import './App.scss';

class App extends Component {
  componentDidMount = async () => {};

  render() {
    return (
      <div>
        <Helmet>
          <script
            type="text/javascript"
            src={`https://maps.googleapis.com/maps/api/js?key=${
              process.env.REACT_APP_GOOGLE_API_KEY
            }&libraries=places&geocode`}
          />
        </Helmet>
        <Web3Provider supportedNetworks={[1, 3, 4, 42, 4447]}>
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
