import React, { Component } from 'react';

import './BcProcessor.scss';
import { BcProcessorConsumer } from '../../../contexts/BcProcessorContext';

class BcProcessor extends Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <p>{this.props.bcProcessor.test}</p>
        <button onClick={this.props.bcProcessor.clearHistory}>
          Clear History
        </button>

        <div className="divTable">
          {!this.props.bcProcessor.txList.length ? <p>no txs</p> : null}

          {this.props.bcProcessor.txList.map((txItem) => {
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
                    <button
                      onClick={() =>
                        this.props.bcProcessor.checkTransaction(txItem.tx)
                      }
                    >
                      ?
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        {this.props.bcProcessor.txList.length ? (
          <button onClick={this.props.bcProcessor.clearHistory}>
            Clear History
          </button>
        ) : null}
      </div>
    );
  }
}

export default BcProcessor;
