import React, { Component } from 'react';
import WanderingMap from './WanderingMap';

export default class WanderingMapContainer extends Component {
  state = {
    tokens: [
      { lat: 39.7599499, lng: -104.9838489 },
      { lat: 39.7546095, lng: -104.9909238 },
      { lat: 39.7461166, lng: -104.9882192 },
    ],
  };

  render() {
    const coordinates = [...this.state.tokens, ...this.props.coordinates];
    console.log(coordinates);
    return (
      <WanderingMap
        // tokens={this.props.tokens}
        tokens={coordinates}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `600px`, width: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}
