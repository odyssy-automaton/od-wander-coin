import React from 'react';
import { withGoogleMap, GoogleMap, Marker, Polyline } from 'react-google-maps';

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

  return (
    <div>
      <GoogleMap
        defaultZoom={14}
        center={{ lat: 39.7599499, lng: -104.9838489 }}
      >
        {markers}
        <Polyline path={props.tokens} />
      </GoogleMap>
    </div>
  );
});

export default WanderingMap;
