import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ClientInfoConsumer } from '../../../contexts/ClientInfoContext';

import './Header.scss';

class Header extends Component {
  render() {
    return (
      <ClientInfoConsumer>
        {(context) => (
          <div className="Header">
            <div className="Logo">
              <h1 className="Header__title">
                <Link to="/">Wander Coin</Link>
              </h1>
            </div>
            <div className="Navigation--Desktop">
              <Link to="/about">About</Link>
              <Link to="/tokens">Tokens</Link>
              {context.accounts && <p>{context.accounts[0]}</p>}
            </div>
          </div>
        )}
      </ClientInfoConsumer>
    );
  }
}

export default Header;
