import React, { Component } from 'react';

import BcProcessorService from '../../../utils/BcProcessorService';

import './BcProcessor.scss';

class BcProcessor extends Component {
  state = {
    txList: [],
  };
  componentDidMount() {
    this._isMounted = true;
    this.BcProcessorService = new BcProcessorService();
    const txList = this.BcProcessorService.getTxList();
    if (this._isMounted) {
      this.setState({ txList });
    }
  }

  clearHistory = () => {
    this.BcProcessorService.clearHistory();
    this.setState({ txList: [] });
  };

  render() {
    return (
      <div className="tx__list">
        {!this.state.txList.length ? <p>no txs</p> : null}
        {this.state.txList.map((txItem) => {
          return (
            <div key={txItem.tx} className="tx__item">
              <p>{txItem.tx}</p>
              <p className="tiny">{txItem.description}</p>
              <p className="tiny">status: {'' + txItem.open}</p>
              <hr />
            </div>
          );
        })}
        <button onClick={this.clearHistory}>Clear History</button>
      </div>
    );
  }
}

export default BcProcessor;
