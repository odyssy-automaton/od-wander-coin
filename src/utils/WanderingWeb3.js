import WanderingAbi from '../contracts/WanderingToken.json';
import { getWeb3ServiceInstance } from './Web3Service';

export default class WanderingService {
  web3Service;
  wanderingContract;

  constructor() {
    this.web3Service = getWeb3ServiceInstance();
    this.tokenAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
  }

  async initContracts() {
    console.log(WanderingAbi.abi);
    return (this.wanderingContract = await this.web3Service.initContract(
      WanderingAbi.abi,
      this.tokenAddress,
    ));
  }

  async getTokenBalance(address) {
    return await this.wanderingContract.methods.balanceOf(address).call();
  }

  async myTokens() {
    return await this.wanderingContract.methods.myTokens().call();
  }

  async owner() {
    console.log(this.wanderingContract.methods);
    return await this.wanderingContract.methods.owner().call();
  }

  coordinateToInt(coordinate) {
    return Math.round(coordinate * 10000000, 7);
  }

  intToCoordinate(int) {
    return parseInt(int, 10) / 10000000;
  }
}
