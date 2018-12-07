export default class BcProcessorService {
  // this service is not used anymore
  txItem = {
    tx: null,
    account: null,
    open: null,
    description: null,
  };

  setTx(tx, account, description = '', open = true) {
    const txList = JSON.parse(localStorage.getItem('txList')) || [];
    const txItem = this.txItem;
    const exists = txList.findIndex((item) => item.tx === tx);

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
}
