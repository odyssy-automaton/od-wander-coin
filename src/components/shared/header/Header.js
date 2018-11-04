import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Header.scss';

class Header extends Component {
  render() {
    return (
      <div className="Header">
        <div>
          <h1 className="Header__title">
            <Link to="/">Wander Coin</Link>
          </h1>
        </div>
        <Link to="/about">About</Link>
        <Link to="/data">Data</Link>
        <Link to="/tokens">Tokens</Link>
      </div>
    );
  }
}

export default Header;
