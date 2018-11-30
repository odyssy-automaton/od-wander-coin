import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import TokenIcon from '../shared/token-icon';
import { totalDistance, mphFromLaunch } from '../../utils/distanceHelpers';

class TokenRow extends Component {
  state = {
    loading: true,
    txMeta: [],
    totalDistance: null,
    tokenMeta: null,
    mph: null,
  };
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    this.loadMeta();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadMeta = async () => {
    const txMeta = await this.props.context.wanderingService.getAllOwnerCords(
      this.props.tokenId,
    );

    const tokenMeta = await this.props.context.wanderingService.getTokenMetaData(
      this.props.tokenId,
    );

    if (this._isMounted) {
      this.setState({
        txMeta,
        tokenMeta,
        loading: false,
        totalDistance: totalDistance(txMeta),
        mph: mphFromLaunch(txMeta, totalDistance(txMeta)),
      });
    }
  };

  render() {
    const { tokenId } = this.props;
    const { loading, tokenMeta, txMeta, totalDistance, mph } = this.state;

    return loading ? (
      <p>Loading Tokens ...</p>
    ) : (
      <div className="divTableRow">
        <div className="divTableCell">{tokenId}</div>
        <div className="divTableCell">
          <Link to={`/tokens/${tokenId}`}>
            <TokenIcon
              color={tokenMeta.extra.color}
              id={tokenId}
              name={tokenMeta.name}
              className="Tokens__Icon--Small"
            />
            {tokenMeta.name}
          </Link>
        </div>
        <div className="divTableCell">{tokenMeta.description}</div>
        <div className="divTableCell">{txMeta.length}</div>
        <div className="divTableCell">{totalDistance}</div>
        <div className="divTableCell">{mph}</div>
      </div>
    );
  }
}

export default TokenRow;
