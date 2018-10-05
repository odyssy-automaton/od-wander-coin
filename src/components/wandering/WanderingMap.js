import React from 'react';
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';

import { mapStyles } from './mapStyles';

const WanderingMap = withGoogleMap((props) => {
  const markers = props.tokens.map((token, i) => (
    <Marker
      key={i}
      position={{
        lat: token.lat,
        lng: token.lng,
      }}
    />
  ));

  const centerCoord =
    props.tokens.length > 0
      ? props.tokens[props.tokens.length - 1]
      : { lat: 39.7599499, lng: -104.9838489 };

  return (
    <div>
      <GoogleMap
        defaultOptions={{ styles: mapStyles }}
        defaultZoom={12}
        center={centerCoord}
      >
        {markers}
        <Polyline path={props.tokens} />
      </GoogleMap>
    </div>
  );
});

export default WanderingMap;
