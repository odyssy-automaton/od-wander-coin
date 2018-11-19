import React, { Component } from 'react';
import { Marker, InfoWindow } from 'react-google-maps';

class CoinMarker extends Component {
  state = {
    showInfo: false,
  };

  onMarkerClick = () => {
    this.setState({ showInfo: !this.state.showInfo });
  };

  render() {
    const { token } = this.props;
    const { showInfo } = this.state;

    console.log(token);

    return (
      <Marker
        position={{
          lat: token.lat,
          lng: token.lng,
        }}
        onClick={this.onMarkerClick}
      >
        {showInfo && (
          <InfoWindow>
            <div>
              <h5>{token.journal}</h5>
              <p>Lat: {token.lat}</p>
              <p>Lng: {token.lng}</p>
            </div>
          </InfoWindow>
        )}
      </Marker>
    );
  }
}

export default CoinMarker;
