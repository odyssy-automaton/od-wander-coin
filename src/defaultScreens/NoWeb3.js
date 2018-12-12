import React, { memo } from 'react';
import ErrorTemplate from './template/ErrorTemplate';

export default memo(function NoWeb3() {
  return (
    <ErrorTemplate
      title="No Web3 Provider"
      message={
        <p>
          Welcome to Wandercoin. Your browser does not have Web3 capabilities.
          Please consider installing{' '}
          <a
            href="https://metamask.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            MetaMask
          </a>{' '}
          (or{' '}
          <a
            href="https://trustwalletapp.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Trust Wallet
          </a>{' '}
          on mobile).
        </p>
      }
    />
  );
});
