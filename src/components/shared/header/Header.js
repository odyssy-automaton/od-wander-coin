import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Web3Consumer } from 'web3-react';

import './Header.scss';

class Header extends Component {
  render() {
    return (
      <Web3Consumer>
        {(context) => (
          <div className="Header">
            <div className="Logo">
              <h1 className="Header__title">
                <Link to="/">Wander Coin</Link>
              </h1>
            </div>
            <div className="Navigation--Desktop">
              <Link to="/about">About</Link>
              <Link to="/data">Data</Link>
              <Link to="/tokens">Tokens</Link>
              {context.account && <p>{context.account}</p>}
            </div>
          </div>
        )}
      </Web3Consumer>
    );
  }
}

export default Header;
