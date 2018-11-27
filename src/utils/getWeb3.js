import Web3 from 'web3';

export class ClientInfo {
  constructor() {
    this.browserInfo = new BrowserInfo();
    this.web3Info = new Web3Info();
  }
}

export class Web3Info {
  getProviderInfo(web3) {
    this.isMetammask = web3.currentProvider.isMetaMask;
    this.isTrust = web3.currentProvider.isTrust;
    this.isToshi = typeof window.SOFA !== 'undefined';
    this.isCipher = typeof window.__CIPHER__ !== 'undefined';
    this.isMist = web3.currentProvider.constructor.name === 'EthereumProvider';
    this.isParity =
      web3.currentProvider.constructor.name === 'Web3FrameProvider';
    this.isInfura =
      web3.currentProvider.host &&
      window.web3.currentProvider.host.indexOf('infura') !== -1;
    this.isLocalhost =
      window.web3.currentProvider.host &&
      window.web3.currentProvider.host.indexOf('localhost') !== -1;

    this.isUnknown =
      !this.isMetammask &&
      !this.isTrust &&
      !this.isToshi &&
      !this.isCipher &&
      !this.isMist &&
      !this.isParity &&
      !this.isInfura &&
      !this.isLocalhost;
  }

  async getAccountInfo(web3) {
    this.accounts = await web3.eth.getAccounts();
    if (this.accounts && this.accounts.length) {
      this.loggedIn = true;
      this.balance = await web3.eth.getBalance(this.accounts[0]);
      // console.log('logged in!');
    } else if (this.accounts && !this.accounts.length) {
      // console.log('logged out or privacy mode');

      this.loggedIn = false;
    } else {
      // console.log('logged out or privacy mode');
      // console.log('no accounts from web3. what does this mean? ');
      this.loggedIn = false;
    }
  }

  async getNetworkInfo(web3) {
    this.network = '';
    this.networkId = await web3.eth.net.getId();
    this.networkType = await web3.eth.net.getNetworkType();
    // console.log('network', this.networkId, this.networkType);
  }

  getcurrentProvider(web3) {
    this.provider = web3.currentProvider;
    // console.log('provider', this.provider);
  }

  checkWeb3andFallback(web3, resolve, reject) {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask).
    const alreadyInjected = typeof web3 !== 'undefined';

    if (alreadyInjected) {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);
      // console.log('Injected web3 detected.');
      resolve(web3);
    } else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      // should use infura instead?
      //const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      //web3 = new Web3(provider);
      //console.log('No web3 instance injected, using Local web3.');
      //resolve(web3);
      reject();
    }
  }

  getWeb3() {
    return new Promise((resolve, reject) => {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      let web3 = undefined;
      window.addEventListener('load', () => {
        if (window.ethereum) {
          // does this check for new metamask
          // what to do when rejected
          window.ethereum
            .enable()
            .then((arg1) => {
              console.log('user approves', arg1);
              web3 = window.web3;
              this.checkWeb3andFallback(web3, resolve, reject);
            })
            .catch((arg1) => {
              console.log('user disaproves', arg1);
              reject();
            });
        } else {
          web3 = window.web3;
          this.checkWeb3andFallback(web3, resolve, reject);
        }
      });
    });
  }

  async init() {
    this.env = process.env.NODE_ENV;
    //TODO: update web3Service and update checks if logged in or no metamask use infura or local
    this.web3 = this.web3 || (await this.getWeb3());
    this.getcurrentProvider(this.web3);
    this.getProviderInfo(this.web3);
    await this.getAccountInfo(this.web3);
    await this.getNetworkInfo(this.web3);

    //add event listeners
    const updateCallback = (change) => {
      if (
        this.accounts[0].toString().toUpperCase() !==
        change.selectedAddress.toUpperCase()
      ) {
        console.log('address changed');
        window.location.reload();
      }
      // does not work will need case staement to guess id
      // if (this.networkId !== change.networkVersion) {
      //   console.log('network changed');
      // }
    };

    this.web3.currentProvider.publicConfigStore.on('update', updateCallback);
  }
}

export class BrowserInfo {
/* eslint-disable */
    constructor() {
    // Opera 8.0+
        this.isOpera =
          (!!window.opr && !!opr.addons) || //es
          !!window.opera ||
          navigator.userAgent.indexOf(' OPR/') >= 0;
        // Firefox 1.0+
        this.isFirefox = typeof InstallTrigger !== 'undefined';
        // Safari 3.0+ "[object HTMLElementConstructor]"
        this.isSafari =
          /constructor/i.test(window.HTMLElement) ||
          (function(p) {
            return p.toString() === '[object SafariRemoteNotification]';
          })(
            !window['safari'] ||
              (typeof safari !== 'undefined' && safari.pushNotification),
          );
        // Internet Explorer 6-11
        this.isIE = /*@cc_on!@*/ false || !!document.documentMode;
        // Edge 20+
        this.isEdge = !this.isIE && !!window.StyleMedia;
        // Chrome 1+
        this.isChrome = !!window.chrome && !!window.chrome.webstore;
    
        this.metaMaskSupport = this.isChrome || this.isFirefox || this.isOpera;
    }
    /* eslint-enable */

}
