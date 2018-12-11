import WanderingAbi from '../../src/dist/contracts/WanderingToken.json';
import Web3Service from './Web3Service';
import OdJsonService from './OdJsonService';

export default class WanderingService {
  web3Service;
  wanderingContract;

  constructor(web3) {
    this.web3Service = new Web3Service(web3);
    this.odJsonService = new OdJsonService();

    if (process.env.NODE_ENV === 'development') {
      this.tokenAddress = process.env.REACT_APP_LOC_CONTRACT_ADDRESS;
    } else {
      this.tokenAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
    }
  }

  async initContracts() {
    return (this.wanderingContract = await this.web3Service.initContract(
      WanderingAbi.abi,
      this.tokenAddress,
    ));
  }

  async sendTo(from, to, tokenId, transfer) {
    // build txJSON, save and get txURI
    const txJSON = transfer;

    const txURI = await this.odJsonService.getUri(txJSON);
    const dummydata = this.web3Service.asciiToHex('0');

    return this.wanderingContract.methods.safeTransferFrom(
      from,
      to,
      tokenId,
      dummydata,
      txURI,
    );
  }

  async launchToken(transfer) {
    const tokenJSON = {
      name: transfer.tokenName,
      description: transfer.journal,
      image: 'https://s3.amazonaws.com/odyssy-assets/wanderface2.png',
      extra: {
        color: transfer.tokenColor,
      },
    };

    const txJSON = {
      latitude: transfer.latitude,
      longitude: transfer.longitude,
      streetAddress: transfer.streetAddress,
      journal: transfer.journal,
      timestamp: new Date().getTime(),
    };

    const tokenURI = await this.odJsonService.getUri(tokenJSON);
    const txURI = await this.odJsonService.getUri(txJSON);

    return this.wanderingContract.methods.launchToken(txURI, tokenURI);
  }

  async getTotalSupply() {
    return await this.wanderingContract.methods.totalSupply().call();
  }

  async getCoordinates(address, tokenId = 1) {
    const res = await this.wanderingContract.methods
      .getCoordinates(address, tokenId)
      .call();
    return res;
  }

  async getOwner(tokenId = 1) {
    try {
      return await this.wanderingContract.methods.ownerOf(tokenId).call();
    } catch {
      return false;
    }
  }

  async addrHasOwned(addr, tokenId = 1) {
    try {
      return await this.wanderingContract.methods
        .addrHasOwned(addr, tokenId)
        .call();
    } catch {
      return 'bad addr';
    }
  }

  async getAllOwnerCords(tokenId = 1) {
    const coords = [];
    const owners = [];
    const contract = this.wanderingContract.methods;
    const numOwners = await contract.numOwners().call();
    // loop through the total number of owners on all tokens
    // problem here - because we are looping through all owners and some owners have
    // owned multile coins. we have to sort the coords on return
    for (let i = 0; i < numOwners; i++) {
      // get the owners address from look up table
      let addr = await contract.ownersLUT(i).call();
      let addrHasOwned = await contract.addrHasOwned(addr, tokenId).call();
      // check if owner has owned a token by id
      if (addrHasOwned) {
        // check if this owner has been added already
        // if so continue because that means its a different token id
        if (owners.includes(addr)) {
          continue;
        }
        owners.push(addr);
        // get the URI for the tx meta
        let txURI = await contract.getTxURI(addr, tokenId).call();
        // verfiy that txURI is from our server
        if (!this.odJsonService.verifyBaseURL(txURI)) {
          console.error({ error: 'not a valid uri' });
          continue;
        }

        // get meta json for tx
        const txJSON = await fetch(txURI, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(function(response) {
          return response.json();
        });
        coords.push({
          lat: txJSON.latitude,
          lng: txJSON.longitude,
          streetAddress: txJSON.streetAddress,
          journal: txJSON.journal,
          timestamp: txJSON.timestamp || '',
        });
      }
    }
    // sort on timestamp
    return coords.sort(function(a, b) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  }

  async balanceOfTank() {
    return this.wanderingContract.methods.balanceOfTank().call();
  }

  async sendTransaction(from, value) {
    return this.web3Service.web3.eth
      .sendTransaction({
        from: from,
        to: this.tokenAddress,
        value: value,
      })
      .once('transactionHash', (hash) => {
        console.log(hash);
      })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTokenURI(tokenId) {
    return this.wanderingContract.methods.tokenURI(tokenId).call();
  }

  async totalSupply() {
    return await this.wanderingContract.methods.totalSupply().call();
  }

  async getTokenMetaData(tokenId) {
    const tokenURI = await this.getTokenURI(tokenId);

    return fetch(tokenURI, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(function(response) {
        return response.json();
      })
      .catch((err) => console.log(err));
  }

  toEth(value) {
    return this.web3Service.toEth(value);
  }

  toWei(value) {
    return this.web3Service.toWei(value);
  }
}
