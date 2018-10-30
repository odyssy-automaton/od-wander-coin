import React, { Component } from 'react';

import './Header.scss';

class Header extends Component {
  render() {
    return (
      <div className="Header">
        <div>
          <h1 className="Header__title"><a href="/">Wander Coin</a></h1>
        </div>
      </div>
    );
  }
}

export default Header;
