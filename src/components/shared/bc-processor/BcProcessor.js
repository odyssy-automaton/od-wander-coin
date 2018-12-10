import React, { Component } from 'react';
import IconBlockCheck from '../icon-block-check/IconBlockCheck.js';
import IconBlockPending from '../icon-block-pending/IconBlockPending.js';

import './BcProcessor.scss';

class BcProcessor extends Component {
  componentDidMount() {}

  render() {
    return (
      <div className="BcProcessor__Container">
        <div className="Tx__List">
          <h6>Transactions</h6>
          {!this.props.bcProcessor.txList.length ? <p>Your transactions will appear here.</p> : null}

          {this.props.bcProcessor.txList.map((txItem) => {
            return (
              <div className="Tx" key={txItem.tx}>
                <div className="Tx__Main">
                  <div className="Tx__Status">
                    {!txItem.open && (
                      <span className="color--success">Complete</span>
                    )}
                    {txItem.open && <span className="">Pending</span>}
                  </div>
                  <div className="Tx__Description">{txItem.description}</div>
                  <div className="Tx__Hash">
                    <a
                      href={'https://etherscan.io/tx/' + txItem.tx}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Etherscan
                    </a>
                  </div>
                  <div className="Tx__Refresh">
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
                <div className="Tx__Secondary">
                  {!txItem.open && (
                    <span>
                      <IconBlockCheck />
                    </span>
                  )}
                  {txItem.open && (
                    <span>
                      <IconBlockPending />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {this.props.bcProcessor.txList.length ? (
          <button onClick={() => this.props.bcProcessor.clearHistory()}>
            Clear History
          </button>
        ) : null}
      </div>
    );
  }
}

export default BcProcessor;
