import React, { Component, Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './Routes';
import Header from './components/shared/header';

import './App.scss';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Fragment>
            <Header />
            <Routes />
          </Fragment>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
