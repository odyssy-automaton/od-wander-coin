import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BcProcessor from '../bc-processor/BcProcessor';
import IconSwapHoriz from '../icon-swap-horiz/IconSwapHoriz';

import './Header.scss';
import { BcProcessorConsumer } from '../../../contexts/BcProcessorContext';

class Header extends Component {
  state = {
    showDropdown: false,
  };

  // Dropdown
  showProcessor = () => {
    this.setState({ showDropdown: true });
  };

  hideProcessor = () => {
    this.setState({ showDropdown: false });
  };

  render() {
    return (
      <BcProcessorConsumer>
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
              <button className="button" onClick={this.showProcessor}>
                <IconSwapHoriz />{' '}
                {context.getTxPendingList().length ? (
                  <span role="img" aria-label="indicator">
                    💡
                  </span>
                ) : null}
              </button>
              {this.state.showDropdown && (
                <div className="dropdown">
                  <div className="dropdown--processor">
                    <BcProcessor
                      bcProcessor={context}
                      account={context.account}
                      web3={context.web3}
                      show={this.state.showDropdown}
                    />
                  </div>
                  <div
                    className="dropdown--backdrop"
                    onClick={this.hideProcessor}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </BcProcessorConsumer>
    );
  }
}

export default Header;
