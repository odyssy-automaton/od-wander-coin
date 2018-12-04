export default class BcProcessorService {
  txItem = {
    tx: null,
    open: null,
    description: null,
  };

  setTx(tx, description = '', open = true) {
    const txList = this.getTxList();
    const txItem = this.txItem;
    const exists = txList.findIndex((item) => item.tx === tx);

    if (exists === -1) {
      txItem.tx = tx;
      txItem.open = open;
      txItem.description = description;
      txList.push(txItem);
      localStorage.setItem('txList', JSON.stringify(txList));
    } else if (txList[exists].open !== open) {
      txList[exists].open = open;
      localStorage.setItem('txList', JSON.stringify(txList));
    }
  }

  getTxList() {
    return JSON.parse(localStorage.getItem('txList')) || [];
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
