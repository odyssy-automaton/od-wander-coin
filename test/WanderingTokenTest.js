import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)
const { expect, assert } = chai

const WanderingToken = artifacts.require("WanderingToken");

contract('Testing WanderingToken contract', function(accounts) {
  let token;
  const name = "WanderingToken";
  const symbol = "ODW"
  
  const account1 = accounts[0]

  before(async () => {
    token = await WanderingToken.new(name, symbol);
  });

  describe('minting', () => {
    it("should be able to deploy and make first account an owner", async () => {
      expect(await token.symbol()).to.equal(symbol);
      expect(await token.name()).to.equal(name);

      let owner = await token.owner();
      expect(owner).to.equal(account1);
    });
  });
});