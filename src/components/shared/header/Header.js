import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../modal/Modal';
import BcProcessor from '../bc-processor/BcProcessor';
import IconSwapHoriz from '../icon-swap-horiz/IconSwapHoriz';

import './Header.scss';
import { BcProcessorConsumer } from '../../../contexts/BcProcessorContext';

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
      <BcProcessorConsumer>
        {(context) => (
          <div className="Header">
            <Modal show={this.state.show} handleClose={this.hideModal}>
                <BcProcessor
                  bcProcessor={context}
                  account={context.account}
                  web3={context.web3}
                />
            </Modal>
            <div className="Logo">
              <h1 className="Header__title">
                <Link to="/">Wander Coin</Link>
              </h1>
            </div>
            <div className="Navigation--Desktop">
              <Link to="/about">About</Link>
              <Link to="/tokens">Tokens</Link>
              <button className="button button--BcProcessor" onClick={this.showModal}>
                <IconSwapHoriz />
              </button>
            </div>
          </div>
        )}
      </BcProcessorConsumer>
    );
  }
}

export default Header;
