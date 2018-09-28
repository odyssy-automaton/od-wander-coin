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
    console.log(WanderingAbi.abi);
    return (this.wanderingContract = await this.web3Service.initContract(
      WanderingAbi.abi,
      this.tokenAddress,
    ));
  }

  async mintTo(address, streetAddress, latitude, longitude) {
    const latInt = this.coordinateToInt(latitude);
    const lngInt = this.coordinateToInt(longitude);

    return await this.landlordContract.methods
      .mintUniqueTokenTo(address, streetAddress, latInt, lngInt)
      .send({ from: address });
  }

  // async getTokenBalance(address) {
  //   return await this.wanderingContract.methods.balanceOf(address).call();
  // }

  // async myTokens() {
  //   return await this.wanderingContract.methods.myTokens().call();
  // }

  coordinateToInt(coordinate) {
    return Math.round(coordinate * 10000000, 7);
  }

  intToCoordinate(int) {
    return parseInt(int, 10) / 10000000;
  }
}
