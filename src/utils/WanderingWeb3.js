import WanderingAbi from '../../src/dist/WanderingToken.json';
import { getWeb3ServiceInstance } from './Web3Service';
import OdJsonService from '../../utils/OdJsonService';

export default class WanderingService {
  web3Service;
  wanderingContract;

  constructor() {
    this.web3Service = getWeb3ServiceInstance();
    this.tokenAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  }

  async initContracts() {
    return (this.wanderingContract = await this.web3Service.initContract(
      WanderingAbi.abi,
      this.tokenAddress,
    ));
  }

  async sendTo(from, to, latitude, longitude, tokenId) {
    // build txJSON, save and get txURI
    const txJSON = {
      latitude: latitude,
      longitude: longitude,
      journal: 'A new Entry.',
    };

    const txURI = await this.OdJsonService.getUri(txJSON);

    return await this.wanderingContract.methods
      .safeTransferFrom(from, to, tokenId, txURI)
      .send({ from: from });
  }

  async launchToken(from, latitude, longitude) {
    //const latInt = this.coordinateToInt(latitude);
    //const lngInt = this.coordinateToInt(longitude);
    // build txJSON, save and get txURI
    const txJSON = {
      latitude: latitude,
      longitude: longitude,
      journal: 'A new start.',
    };
    const txURI = await this.OdJsonService.getUri(txJSON);

    await this.wanderingContract.methods
      .launchToken(txURI)
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
        console.log(txURI);

        //get txURI json

        //coords.push({
        //  lat: this.intToCoordinate(coord.latitude),
        //  lng: this.intToCoordinate(coord.longitude),
        //});
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
      to: process.env.REACT_APP_CONTRACT_ADDRESS,
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
