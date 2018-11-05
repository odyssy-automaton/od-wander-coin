var WanderingToken = artifacts.require("./WanderingToken.sol");

module.exports = function(deployer) {
  deployer.deploy(
    WanderingToken, 
    'Wandering Gnome', 
    'GNOME', 
    "https://s3.amazonaws.com/odyssy-json/txURI.json", 
    "https://s3.amazonaws.com/odyssy-json/TokenURI.json");
};
