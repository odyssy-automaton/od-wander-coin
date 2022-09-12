import React, { Component } from 'react';
import Web3Service from '../utils/Web3Service';

const BcProcessorContext = React.createContext();

export default class BcProcessorProvider extends Component {
  txItem = {
    tx: null,
    account: null,
    open: null,
    description: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      clearHistory: this.clearHistory,
      checkTransaction: this.checkTransaction,
      getTxPendingList: this.getTxPendingList,
      setTx: this.setTx,
      txList: [],
      web3: this.props.web3,
      account: this.props.account,
    };
    this.web3Service = new Web3Service(this.props.web3);
  }

  componentDidMount() {
    const txList = this.getTxList(this.props.account);
    let pendingList = this.getTxPendingList(this.props.account);

    this.setState({ txList, web3: this.props.web3 });

    if (pendingList.length) {
      const intervalId = setInterval(() => {
        console.log('interval running', pendingList.length);

        for (let i = 0; i < pendingList.length - 1; i++) {
          console.log(pendingList[i].tx);

          this.checkTransaction(pendingList[i].tx);
        }
        pendingList = this.getTxPendingList(this.props.account);
        if (!pendingList.length) {
          clearInterval(intervalId);
        }
      }, 1000);
    }
  }

  checkTransaction = async (transactionHash) => {
    const status = await this.web3Service.getTransactionStatus(transactionHash);
    console.log(status, transactionHash);

    if (status.blockNumber) {
      this.setTx(transactionHash, this.props.account, 'completed', false);
    }
  };

  setTx = (tx, account, description = '', open = true, tokenId = null) => {
    const txList = JSON.parse(localStorage.getItem('txList')) || [];
    const txItem = {};
    const exists = txList.findIndex((item) => item.tx === tx);
    console.log('id', tokenId, 'exists', exists);

    if (exists === -1) {
      txItem.tx = tx;
      txItem.account = account;
      txItem.open = open;
      txItem.description = description;
      if (tokenId) {
        txItem.tokenId = tokenId;
      }
      txList.push(txItem);
      localStorage.setItem('txList', JSON.stringify(txList));
    } else if (txList[exists].open !== open) {
      txList[exists].open = open;
      if (tokenId) {
        txList[exists].tokenId = tokenId;
      }
      localStorage.setItem('txList', JSON.stringify(txList));
    }
    this.setState({ txList });
  };

  getTxList = (account) => {
    const txList = JSON.parse(localStorage.getItem('txList')) || [];

    return txList.filter((item) => item.account === account);
  };

  getTxPendingList = (account) => {
    const txList = JSON.parse(localStorage.getItem('txList')) || [];

    return txList.filter((item) => item.account === account && item.open);
  };

  getTx = (tx) => {
    return JSON.parse(localStorage.getItem('txList')).find(
      (item) => item.tx === tx,
    );
  };

  clearHistory = () => {
    localStorage.removeItem('txList');
    // needs to clear for account
    this.setState({ txList: [] });
  };

  render() {
    return (
      <BcProcessorContext.Provider value={this.state}>
        {this.props.children}
      </BcProcessorContext.Provider>
    );
  }
}
export const BcProcessorConsumer = BcProcessorContext.Consumer;
