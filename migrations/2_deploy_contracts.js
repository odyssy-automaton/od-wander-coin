var WanderingToken = artifacts.require("./WanderingToken.sol");

module.exports = function(deployer) {
  deployer.deploy(WanderingToken, 'Wandering Gnome', 'GNOME', 397617862, -1049445372);
};
