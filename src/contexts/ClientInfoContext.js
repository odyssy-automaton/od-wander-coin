import React from 'react';

const ClientInfoContext = React.createContext({});

export const ClientInfoProvider = ClientInfoContext.Provider;
export const ClientInfoConsumer = ClientInfoContext.Consumer;
