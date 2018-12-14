import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Web3 from 'web3';
import { Helmet } from 'react-helmet';

import Routes from '../Routes';
import Header from '../components/shared/header';
import BcProcessorProvider from '../contexts/BcProcessorContext';

class NoWeb3 extends Component {
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
        <BrowserRouter>
          <BcProcessorProvider
            web3={new Web3(process.env.REACT_APP_REMOTE_WEB3_PROVIDER)}
            account={''}
          >
            <Fragment>
              <Header />
              <div>
                <Routes />
              </div>
            </Fragment>
          </BcProcessorProvider>
        </BrowserRouter>
      </div>
    );
  }
}

export default NoWeb3;
