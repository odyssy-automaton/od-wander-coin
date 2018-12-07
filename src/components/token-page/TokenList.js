import React, { Component } from 'react';

import TokenRow from './TokenRow';
import { TokensConsumer } from '../../contexts/TokensContext';

import './TokenPage.scss';

class TokenList extends Component {
  state = {
    totalTokens: '',
    tokenNumber: '',
  };

  componentDidMount = async () => {
    this.getTotalTokens();
  };

  getTotalTokens = async () => {
    const { onLoad } = this.props;
    const totalTokens = await onLoad();

    this.setState({ totalTokens });
  };

  tokenRows = () => {
    return [...Array(+this.state.totalTokens).keys()].map((i) => {
      return (
        <TokensConsumer key={i}>
          {(context) => (
            <TokenRow
              tokenId={i + 1}
              contract={this.props.contract}
              key={i}
              context={context}
              account={this.props.account}
            />
          )}
        </TokensConsumer>
      );
    });
  };

  render() {
    const tokenRows = this.tokenRows();

    return (
      <div>
        <p>{this.state.totalTokens} Token(s)</p>

        <div className="divTable">
          <div className="divTableBody">
            <div className="divTableRow">
              <div className="divTableCell Column--Heading">ID</div>
              <div className="divTableCell Column--Heading">Name</div>
              <div className="divTableCell Column--Heading">Purpose</div>
              <div className="divTableCell Column--Heading"># of Stops</div>
              <div className="divTableCell Column--Heading">Miles Traveled</div>
              <div className="divTableCell Column--Heading">MPH</div>
            </div>
            {tokenRows}
          </div>
        </div>
      </div>
    );
  }
}

export default TokenList;
