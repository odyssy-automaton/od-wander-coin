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
    // console.log(
    //   'env',
    //   process.env.NODE_ENV,
    //   this.tokenAddress,
    //   process.env.REACT_APP_CONTRACT_ADDRESS,
    //   process.env.REACT_APP_LOC_CONTRACT_ADDRESS,
    // );
  }

  async initContracts() {
    return (this.wanderingContract = await this.web3Service.initContract(
      WanderingAbi.abi,
      this.tokenAddress,
    ));
  }

  async sendTo(from, to, latitude, longitude, streetAddress, journal, tokenId) {
    // build txJSON, save and get txURI
    const txJSON = {
      latitude,
      longitude,
      streetAddress,
      journal,
    };

    const txURI = await this.odJsonService.getUri(txJSON);

    return this.wanderingContract.methods
      .safeTransferFrom(from, to, tokenId, '0x0', txURI)
      .send({ from: from })
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async launchToken(from, latitude, longitude, streetAddress, journal) {
    // build txJSON, save and get txURI
    const txJSON = {
      latitude,
      longitude,
      streetAddress,
      journal,
    };
    const tokenJSON = {
      name: 'WanderCoin',
      description: 'A token that wanders around the world.',
      image: 'https://s3.amazonaws.com/odyssy-assets/wanderface.png',
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

  async addrHasOwned(addr, tokenId = 1) {
    return await this.wanderingContract.methods
      .addrHasOwned(addr, tokenId)
      .call();
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
        if (!this.odJsonService.verifyBaseURL(txURI)) {
          console.log('huh', this.odJsonService.verifyBaseURL(txURI), txURI);
          console.error({ error: 'not a valid uri' });
          continue;
        }

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
        });
      }
    }
    return coords;
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
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
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
