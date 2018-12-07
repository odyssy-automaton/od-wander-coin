import React, { Component } from 'react';

const BcProcessorContext = React.createContext();

export default class BcProcessorProvider extends Component {
  txItem = {
    tx: null,
    account: null,
    open: null,
    description: null,
  };
  state = {
    test: 'hello test',
    clearHistory: this.clearHistory,
    checkTransaction: this.checkTransaction,
    setTx: this.setTx,
    txList: [],
    web3: this.props.web3,
    account: this.props.account,
  };

  constructor(props) {
    super(props);
    console.log('prps', props);
  }

  onComponentDidMount() {
    const txList = this.getTxList(this.props.account);

    this.setState({ txList, web3: this.props.web3 });

    setInterval(() => {
      console.log('test');

      const txList = this.getTxList(this.props.account);
      this.setState({ txList });
    }, 1000);
  }

  async checkTransaction(transactionHash) {
    const status = await this.web3Service.getTransactionStatus(transactionHash);
    console.log(status);

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

  setTx(tx, account, description = '', open = true) {
    console.log(tx, account, (description = ''), (open = true));

    const txList = JSON.parse(localStorage.getItem('txList')) || [];
    const txItem = {};
    const exists = txList.findIndex((item) => item.tx === tx);
    console.log('[[[[', txItem);

    if (exists === -1) {
      txItem.tx = tx;
      txItem.account = account;
      txItem.open = open;
      txItem.description = description;
      txList.push(txItem);
      localStorage.setItem('txList', JSON.stringify(txList));
    } else if (txList[exists].open !== open) {
      txList[exists].open = open;
      txList[exists].description = description;
      localStorage.setItem('txList', JSON.stringify(txList));
    }
    console.log('[[[[', txItem, txList);
  }

  getTxList(account) {
    const txList = JSON.parse(localStorage.getItem('txList')) || [];

    return txList.filter((item) => item.account === account);
  }

  getTx(tx) {
    return JSON.parse(localStorage.getItem('txList')).find(
      (item) => item.tx === tx,
    );
  }

  clearHistory() {
    localStorage.removeItem('txList');
  }

  render() {
    return (
      <BcProcessorContext.Provider value={this.state}>
        {this.props.children}
      </BcProcessorContext.Provider>
    );
  }
}
export const BcProcessorConsumer = BcProcessorContext.Consumer;
