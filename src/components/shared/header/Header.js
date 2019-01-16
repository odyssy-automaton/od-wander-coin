import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BcProcessor from '../bc-processor/BcProcessor';
import GasTank from '../../wandering/gas-tank/GasTank';
import IconSwapHoriz from '../icon-swap-horiz/IconSwapHoriz';

import './Header.scss';
import { BcProcessorConsumer } from '../../../contexts/BcProcessorContext';
import WanderingService from '../../../utils/WanderingWeb3';

class Header extends Component {
  state = {
    showDropdown: false,
    showGasDropdown: false,
  };

  componentDidMount() {
    this._isMounted = true;

    this.wanderingService = new WanderingService(this.props.web3);
    this.loadContract();
  }

  loadContract = async () => {
    return await this.wanderingService.initContracts();
  };

  // Dropdown
  showProcessor = () => {
    this.setState({ showDropdown: true });
  };

  hideProcessor = () => {
    this.setState({ showDropdown: false });
  };

  // Dropdown
  showGas = () => {
    this.setState({ showGasDropdown: true });
  };

  hideGas = () => {
    this.setState({ showGasDropdown: false });
  };

  // gas tank
  handleSubmitGasForm = async (amount) => {
    const amountInWei = await this.wanderingService.toWei(amount.amount);
    const tx = await this.wanderingService.sendTransaction(
      this.props.account,
      amountInWei,
    );

    // this.props.bcProcessor.setTx(
    //   tx.transactionHash,
    //   this.props.account,
    //   'Sent Gas',
    //   false,
    // );

    return tx;
  };

  getBalance = async () => {
    const balance = await this.wanderingService.balanceOfTank();
    return this.wanderingService.toEth(balance);
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
              <button className="button" onClick={this.showGas}>
                Gas
              </button>
              {context.account ? (
                <button className="button" onClick={this.showProcessor}>
                  <IconSwapHoriz />{' '}
                  {context.getTxPendingList().length ? (
                    <span role="img" aria-label="indicator">
                      💡
                    </span>
                  ) : null}
                </button>
              ) : null}
              {this.state.showDropdown ? (
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
              ) : null}
              {this.state.showGasDropdown && context.account ? (
                <div className="dropdown">
                  <div className="dropdown--processor">
                    <GasTank
                      onSubmit={this.handleSubmitGasForm}
                      onLoad={this.getBalance}
                    />
                  </div>
                  <div className="dropdown--backdrop" onClick={this.hideGas} />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </BcProcessorConsumer>
    );
  }
}

export default Header;
