import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TokenRow extends Component {
  state = {
    loading: true,
    tokenMeta: [],
  };

  componentDidMount() {
    console.log('this.props');
    console.log(this.props);

    this.loadTokenMeta();
  }

  loadTokenMeta = async () => {
    const tokenMeta = await this.props.context.wanderingService.getAllOwnerCords(
      this.props.tokenId,
    );

    this.setState({ tokenMeta, loading: false });

    console.log(tokenMeta);
  };

  render() {
    const { tokenId } = this.props;
    const { loading, tokenMeta } = this.state;

    return loading ? (
      <p>loading token data</p>
    ) : (
      <div className="divTableRow">
        <div className="divTableCell">
          <Link to={`/tokens/${tokenId}`}>{tokenId}</Link>
        </div>
        <div className="divTableCell" />
        <div className="divTableCell">{tokenMeta.length}</div>
        <div className="divTableCell" />
        <div className="divTableCell" />
      </div>
    );
  }
}

export default TokenRow;
