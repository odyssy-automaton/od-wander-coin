import React from 'react';

import { distanceFrom } from '../../../utils/distanceHelpers';

import './DistanceFrom.scss';

const DistanceFrom = ({ origin, destination }) => {
  const distance = distanceFrom(origin, destination);

  return (
    <div>
      {distance ? (
        <div className="Distance__notice">
          <p className="tiny">
            <span aria-label="airplane" role="img">
              ✈️
            </span>
            You are {distance} miles from coin's last know destination!
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default DistanceFrom;
