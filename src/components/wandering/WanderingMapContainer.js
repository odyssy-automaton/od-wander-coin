import React, { Component } from 'react';
import WanderingMap from './WanderingMap';

export default class WanderingMapContainer extends Component {
  render() {
    return (
      <WanderingMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${
          process.env.REACT_APP_GOOGLE_API_KEY
        }&libraries=places&geocode`}
        tokens={this.props.coordinates}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%`, width: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}
