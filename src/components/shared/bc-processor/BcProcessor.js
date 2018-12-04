import React, { Component } from 'react';

import BcProcessorService from '../../../utils/BcProcessorService';
import Web3Service from '../../../utils/Web3Service';

import './BcProcessor.scss';

class BcProcessor extends Component {
  state = {
    txList: [],
  };
  componentDidMount() {
    this._isMounted = true;
    this.BcProcessorService = new BcProcessorService();
    this.web3Service = new Web3Service(this.props.web3);
    if (this._isMounted) {
      // this probably needs to be a prop
      setInterval(() => {
        const txList = this.BcProcessorService.getTxList(this.props.account);
        this.setState({ txList });
      }, 1000);
    }
  }

  clearHistory = () => {
    this.BcProcessorService.clearHistory();
    this.setState({ txList: [] });
  };

  async checkTransaction(transactionHash) {
    const status = await this.web3Service.getTransactionStatus(transactionHash);
    if (status) {
      this.BcProcessorService.setTx(
        transactionHash,
        this.props.account,
        'completed',
        false,
      );
    }
    console.log(status);
  }

  render() {
    return (
      <div>
        <div className="divTable">
          {!this.state.txList.length ? <p>no txs</p> : null}

          {this.state.txList.map((txItem) => {
            return (
              <div className="divTableRow" key={txItem.tx}>
                <div className="divTableCell">{txItem.tx}</div>
                <div className="divTableCell"> </div>
                <div className="divTableCell"> </div>
                <div className="divTableCell"> </div>
                <div className="divTableCell">{txItem.description}</div>
                <div className="divTableCell">waiting: {'' + txItem.open}</div>
                <div className="divTableCell">
                  {txItem.open ? (
                    <button onClick={() => this.checkTransaction(txItem.tx)}>
                      ?
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        {this.state.txList.length ? (
          <button onClick={this.clearHistory}>Clear History</button>
        ) : null}
      </div>
    );
  }
}

export default BcProcessor;
