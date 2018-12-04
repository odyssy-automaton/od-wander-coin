import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Web3Consumer } from 'web3-react';
import Modal from '../modal/Modal';
import BcProcessor from '../bc-processor/BcProcessor';

import './Header.scss';

class Header extends Component {
  state = {
    show: false,
  };
  // Modal
  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <Web3Consumer>
        {(context) => (
          <div className="Header">
            <Modal show={this.state.show} handleClose={this.hideModal}>
              <div>
                <BcProcessor account={context.account} web3={context.web3js} />
              </div>
            </Modal>
            <div className="Logo">
              <h1 className="Header__title">
                <Link to="/">Wander Coin</Link>
              </h1>
            </div>
            <div className="Navigation--Desktop">
              <Link to="/about">About</Link>
              <Link to="/tokens">Tokens</Link>
              {context.account && <p>{context.account}</p>}
              <button className="button" onClick={this.showModal}>
                tx list
              </button>
            </div>
          </div>
        )}
      </Web3Consumer>
    );
  }
}

export default Header;
