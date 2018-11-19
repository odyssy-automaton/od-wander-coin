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
    console.log(
      'env',
      process.env.NODE_ENV,
      this.tokenAddress,
      process.env.REACT_APP_CONTRACT_ADDRESS,
      process.env.REACT_APP_LOC_CONTRACT_ADDRESS,
    );
  }

  async initContracts() {
    return (this.wanderingContract = await this.web3Service.initContract(
      WanderingAbi.abi,
      this.tokenAddress,
    ));
  }

  async sendTo(from, to, latitude, longitude, journal, tokenId) {
    // build txJSON, save and get txURI
    const txJSON = {
      latitude: latitude,
      longitude: longitude,
      journal: journal,
    };

    const txURI = await this.odJsonService.getUri(txJSON);

    return await this.wanderingContract.methods
      .safeTransferFrom(from, to, tokenId, '0x0', txURI)
      .send({ from: from });
  }

  async launchToken(from, latitude, longitude) {
    // build txJSON, save and get txURI
    const txJSON = {
      latitude: latitude,
      longitude: longitude,
      journal: 'A new start.',
    };
    const tokenJSON = {
      name: 'WanderCoin',
      description: 'A token that wanders around the world.',
      image: 'https://s3.amazonaws.com/odyssy-assets/wanderface.jpg',
    };
    const txURI = await this.odJsonService.getUri(txJSON);
    const tokenURI = await this.odJsonService.getUri(tokenJSON);

    await this.wanderingContract.methods
      .launchToken(txURI, tokenURI)
      .send({ from: from });

    return await this.wanderingContract.methods.totalSupply().call();
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
    return await this.wanderingContract.methods.ownerOf(tokenId).call();
  }

  async getAllOwnerCords(tokenId = 1) {
    const coords = [];
    const owners = [];
    const contract = this.wanderingContract.methods;
    const numOwners = await contract.numOwners().call();
    for (let i = 0; i < numOwners; i++) {
      let addr = await contract.ownersLUT(i).call();
      let addrHasOwned = await contract.addrHasOwned(addr, tokenId).call();
      if (addrHasOwned) {
        if (owners.includes(addr)) {
          continue;
        }
        owners.push(addr);

        let txURI = await contract.getTxURI(addr, tokenId).call();
        console.log('huh', txURI);
        //console.log('huh', this.web3Service.toAscii(txURI));

        const txJSON = await fetch(txURI, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(function(response) {
          return response.json();
        });
        console.log(txJSON.latitude, txJSON.longitude);

        coords.push({
          lat: txJSON.latitude,
          lng: txJSON.longitude,
          journal: txJSON.journal,
        });
      }
    }
    return coords;
  }

  async balanceOfTank() {
    return await this.wanderingContract.methods.balanceOfTank().call();
  }

  async sendTransaction(from, value) {
    this.web3Service.web3.eth.sendTransaction({
      from: from,
      to: this.tokenAddress,
      value: value,
    });
  }

  toEth(value) {
    return this.web3Service.toEth(value);
  }

  toWei(value) {
    return this.web3Service.toWei(value);
  }

  coordinateToInt(coordinate) {
    return Math.round(coordinate * 10000000, 7);
  }

  intToCoordinate(int) {
    return parseInt(int, 10) / 10000000;
  }
}
