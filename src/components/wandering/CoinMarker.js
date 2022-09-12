import React, { Component } from 'react';
import { Marker, InfoWindow } from 'react-google-maps';
import wanderMarker from '../../../src/assets/wanderMarker.svg';

class CoinMarker extends Component {
  state = {
    showInfo: false,
  };

  onMarkerClick = () => {
    this.setState({ showInfo: !this.state.showInfo });
  };

  render() {
    const { token, tokenKey } = this.props;
    const { showInfo } = this.state;
    const timestamp = token.timestamp
      ? new Date(token.timestamp).toLocaleString()
      : '';

    return (
      <Marker
        position={{
          lat: token.lat,
          lng: token.lng,
        }}
        label={'' + tokenKey}
        icon={wanderMarker}
        onClick={this.onMarkerClick}
      >
        {showInfo && (
          <InfoWindow>
            <div className="GM__Popup">
              <p>{token.journal}</p>
              <div className="GM__Popup--Row">
                <h6>{token.streetAddress}</h6>
                <h6>{timestamp}</h6>
              </div>
            </div>
          </InfoWindow>
        )}
      </Marker>
    );
  }
}

export default CoinMarker;
