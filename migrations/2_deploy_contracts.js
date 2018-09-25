var WanderingToken = artifacts.require("./WanderingToken.sol");

module.exports = function(deployer) {
  deployer.deploy(WanderingToken, 'Wander', 'ODW');
};
