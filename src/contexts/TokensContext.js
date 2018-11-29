import React from 'react';

const TokensContext = React.createContext({});

export const TokensProvider = TokensContext.Provider;
export const TokensConsumer = TokensContext.Consumer;
