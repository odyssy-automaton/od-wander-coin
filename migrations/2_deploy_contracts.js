var WanderingToken = artifacts.require("./WanderingToken.sol");

module.exports = function(deployer) {
  deployer.deploy(WanderingToken, 'Wander', 'ODW', 397617862, -1049445372);
};
