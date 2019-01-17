import React, { Component } from 'react';

import TokenRow from './TokenRow';
import { TokensConsumer } from '../../contexts/TokensContext';

import './TokenPage.scss';

class TokenList extends Component {
  state = {
    tokenNumber: '',
    pageNum: 1,
    pageSize: 5,
    totalTokens: '',
    totalPages: '',
  };

  componentDidMount = async () => {
    await this.getTotalTokens();
    this.getTotalPages();
  };

  getTotalTokens = async () => {
    const { onLoad } = this.props;
    const totalTokens = await onLoad();

    this.setState({ totalTokens });
  };

  range = (pageNum, lastPage, size, total) => {
    console.log('range 1', pageNum, lastPage, size, total);
    if (!pageNum || !lastPage) {
      return [];
    }

    const startAt = pageNum * size - size;
    if (pageNum === lastPage) {
      size = total % size;
    }
    console.log('range 2', pageNum, lastPage, size, total);

    return [...Array(+size).keys()].map((i) => i + startAt);
  };

  getTotalPages = () => {
    this.setState({
      totalPages: Math.ceil(this.state.totalTokens / this.state.pageSize),
    });
    //return parseInt(this.state.totalToken / this.state.pageSize);
  };

  goToPage = (pageNum) => {
    if (pageNum < 0 || pageNum > this.state.totalPages) {
      return;
    }
    this.setState({ pageNum: pageNum });
  };

  tokenRows = () => {
    console.log(
      this.range(
        this.state.pageNum,
        this.state.totalPages,
        this.state.pageSize,
        this.state.totalTokens,
      ),
    );
    console.log([...Array(+this.state.totalTokens).keys()]);
    return this.range(
      this.state.pageNum,
      this.state.totalPages,
      this.state.pageSize,
      this.state.totalTokens,
    ).map((i) => {
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
        <h3>{this.state.totalTokens} Token(s)</h3>

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
        <div className="Paginator">
        { this.state.pageNum != 1 && (
          <button onClick={() => this.goToPage(this.state.pageNum - 1)}>
            Last
          </button>
        )}
          <span>
            {' '}
            Page <strong>{this.state.pageNum}</strong> of <strong>{this.state.totalPages}</strong>{' '}
          </span>
          <button onClick={() => this.goToPage(this.state.pageNum + 1)}>
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default TokenList;
