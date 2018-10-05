require('babel-register');
require('babel-polyfill');
require('dotenv').config()
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = process.env.MENOMIC

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '*', // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/459626663bcf4ae4bcc5cd9b3c8f9ed6")
      },
      network_id: 3
    }   
  }
  },

  
};
