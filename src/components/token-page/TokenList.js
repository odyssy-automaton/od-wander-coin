import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './TokenPage.scss';

class TokenList extends Component {
  state = {
    totalTokens: '',
    tokenNumber: '',
  };

  componentDidMount() {
    this.getTotalTokens();
  }

  getTotalTokens = async () => {
    const { onLoad } = this.props;
    const totalTokens = await onLoad();

    this.setState({ totalTokens });
  };

  handleSelect = (event) => {
    event.persist();

    const { onSelect } = this.props;
    this.setState({ tokenNumber: event.target.value }, () => {
      onSelect(this.state.tokenNumber);
    });
  };

  tokenRows = () => {
    return [...Array(+this.state.totalTokens).keys()].map((i) => {
      return (
        <div className="divTableRow" key={i}>
          <div className="divTableCell">
            <Link to={`/tokens/${i + 1}`}>{i + 1}</Link>
          </div>
          <div className="divTableCell" />
          <div className="divTableCell" />
          <div className="divTableCell" />
          <div className="divTableCell" />
        </div>
      );
    });
  };

  render() {
    const tokenRows = this.tokenRows();

    return (
      <div>
        <h3>Token List: {this.state.totalTokens} total</h3>

        <div className="divTable">
          <div className="divTableBody">
            <div className="divTableRow">
              <div className="divTableCell">Token Name</div>
              <div className="divTableCell">Token Purpose</div>
              <div className="divTableCell"># of Stops</div>
              <div className="divTableCell">Miles Travelled</div>
              <div className="divTableCell">MPH</div>
            </div>
            {tokenRows}
          </div>
        </div>

        <hr />
      </div>
    );
  }
}

export default TokenList;
