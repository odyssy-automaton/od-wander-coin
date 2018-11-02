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

  return (
    <div>
      <GoogleMap
        defaultOptions={{ styles: mapStyles }}
        defaultZoom={9}
        center={centerCoord}
      >
        {markers}
        <Polyline path={props.tokens} options={{}} />
      </GoogleMap>
    </div>
  );
});

export default WanderingMap;
