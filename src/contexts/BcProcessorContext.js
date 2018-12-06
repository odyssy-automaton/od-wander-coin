import React from 'react';

const BcProcessorContext = React.createContext({});

export const BcProcessorProvider = BcProcessorContext.Provider;
export const BcProcessorConsumer = BcProcessorContext.Consumer;
