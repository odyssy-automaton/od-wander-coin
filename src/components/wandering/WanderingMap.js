import React from 'react';
import { withGoogleMap, GoogleMap, Polyline } from 'react-google-maps';

import CoinMarker from './CoinMarker';
import { defaultLocation } from '../../utils/locationHelpers';
import { mapStyles } from './mapStyles';

const WanderingMap = withGoogleMap((props) => {
  const markers = props.tokens.map((token, i) => (
    <CoinMarker key={i} token={token} />
  ));

  const centerCoord =
    props.tokens.length > 0
      ? props.tokens[props.tokens.length - 1]
      : defaultLocation();

  const setZoom = (ref) => {
    if (props.tokens.length > 1) {
      if (!ref) {
        return;
      }
      ref.map = ref;
      var bounds = new window.google.maps.LatLngBounds();
      props.tokens.forEach((p) => {
        var latLng = new window.google.maps.LatLng(p.lat, p.lng);
        bounds.extend(latLng);
      });
      ref.map.fitBounds(bounds);
    }
  };

  return (
    <div>
      <GoogleMap
        ref={setZoom}
        defaultOptions={{ styles: mapStyles }}
        defaultZoom={9}
        center={centerCoord}
      >
        {markers}
        <Polyline path={props.tokens} options={{strokeColor:"#5f5fff"}} />
      </GoogleMap>
    </div>
  );
});

export default WanderingMap;
