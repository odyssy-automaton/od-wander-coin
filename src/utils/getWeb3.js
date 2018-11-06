import Web3 from 'web3';

export const browserObject = {
  browser: {}, // obj
  web3Provider: {}, // obj
  LoggedIn: false, // bool
  networkName: '', // string
  networkId: '', // string
  provider: '', // string
  account: '', // string
  balance: '', // number
};

export class Web3Info {
  constructor(web3) {
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

export const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', () => {
      let web3 = window.web3;

      // Checking if Web3 has been injected by the browser (Mist/MetaMask).
      const alreadyInjected = typeof web3 !== 'undefined';

      if (alreadyInjected) {
        // Use Mist/MetaMask's provider.
        web3 = new Web3(web3.currentProvider);
        console.log('Injected web3 detected.');
        resolve(web3);
      } else {
        // Fallback to localhost if no web3 injection. We've configured this to
        // use the development console's port by default.
        const provider = new Web3.providers.HttpProvider(
          'http://127.0.0.1:9545',
        );
        web3 = new Web3(provider);
        console.log('No web3 instance injected, using Local web3.');
        resolve(web3);
      }
    });
  });
