import WanderingAbi from '../contracts/WanderingToken.json';
import { getWeb3ServiceInstance } from './Web3Service';

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

  async sendTo(from, to, latitude, longitude) {
    const latInt = this.coordinateToInt(latitude);
    const lngInt = this.coordinateToInt(longitude);

    return await this.wanderingContract.methods
      .safeTransferFrom(from, to, latInt, lngInt)
      .send({ from: from });
  }

  async getCoordinates(address) {
    const res = await this.wanderingContract.methods
      .getCoordinates(address)
      .call();
    return {
      lat: this.intToCoordinate(res.latitude),
      lng: this.intToCoordinate(res.longitude),
    };
  }

  async getOwner() {
    return await this.wanderingContract.methods.ownerOf(1).call();
  }

  async balanceOfTank() {
    return await this.wanderingContract.methods.balanceOfTank().call();
  }

  async sendTransaction(from, value) {
    // const value = this.web3Service.toWei(amount);

    console.log(this.web3Service);

    this.web3Service.web3.eth.sendTransaction({
      from: from,
      to: process.env.REACT_APP_CONTRACT_ADDRESS,
      value: value,
    });
  }

  toEth(value) {
    return this.web3Service.eth.toEth(value);
  }

  toWei(value) {
    return this.web3Service.eth.toWei(value);
  }

  coordinateToInt(coordinate) {
    return Math.round(coordinate * 10000000, 7);
  }

  intToCoordinate(int) {
    return parseInt(int, 10) / 10000000;
  }
}
