import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { totalDistance } from '../../utils/distanceHelpers';

class TokenRow extends Component {
  state = {
    loading: true,
    txMeta: [],
    totalDistance: null,
    tokenMeta: null,
  };

  componentDidMount() {
    this.loadMeta();
  }

  loadMeta = async () => {
    const txMeta = await this.props.context.wanderingService.getAllOwnerCords(
      this.props.tokenId,
    );

    const tokenMeta = await this.props.context.wanderingService.getTokenMetaData(
      this.props.tokenId,
    );

    this.setState({
      txMeta,
      tokenMeta,
      loading: false,
      totalDistance: totalDistance(txMeta),
    });
  };

  render() {
    const { tokenId } = this.props;
    const { loading, tokenMeta, txMeta, totalDistance } = this.state;

    return loading ? (
      <p>loading token data</p>
    ) : (
      <div className="divTableRow">
        <div className="divTableCell">
          <img src={tokenMeta.image} width="20px" />
        </div>
        <div className="divTableCell">
          <Link to={`/tokens/${tokenId}`}>
            {tokenId}. {tokenMeta.name}
          </Link>
        </div>
        <div className="divTableCell">{tokenMeta.description}</div>
        <div className="divTableCell">{txMeta.length}</div>
        <div className="divTableCell">{totalDistance}</div>
        <div className="divTableCell" />
      </div>
    );
  }
}

export default TokenRow;
