import React, { Component } from 'react';

// import { getCurrentLocation } from '../../../utils/locationHelpers';
import { defaultLocation } from '../../../utils/locationHelpers';
import { distanceFrom } from '../../../utils/distanceHelpers';

class DistanceFrom extends Component {
  state = {
    destination: {},
  };

  componentWillMount = () => {
    // const { origin } = this.props;
    const destination = { ...defaultLocation() };

    this.setState({
      destination,
      // origin,
    });
  };

  getDistance = () => {
    const { origin } = this.props;

    if (origin && this.state.destination.lat) {
      return distanceFrom(origin, this.state.destination);
    } else {
      return 0;
    }
  };

  render() {
    const distance = this.getDistance();

    return (
      <div>
        {distance ? (
          <div>You are {distance} miles from the Wander Coin</div>
        ) : null}
      </div>
    );
  }
}

export default DistanceFrom;
