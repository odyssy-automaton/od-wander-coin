import React, { Component } from 'react';

import { characterDefs } from './characterDefs';

import './TokenIcon.scss';

class TokenIcon extends Component {
  render() {
    const { color, id, name } = this.props;
    const firstLetter = name.toLowerCase().split('')[0];
    const characterDef = characterDefs[firstLetter];
    const classes = `.TokenIcon--${id} { fill: ${color}; } 
      .TokenIcon--white { fill: #fff; }`;

    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 577.68 577.68">
        <defs>
          <style>{classes}</style>
        </defs>
        <title>wander-coin__token--d--bg</title>
        <circle
          className={`TokenIcon--${id}`}
          cx="288.84"
          cy="288.84"
          r="255.11"
        />
        <path
          className={`TokenIcon--${id}`}
          d="M300,588.84A288.84,288.84,0,0,1,95.76,95.76a288.93,288.93,0,0,1,472.57,97.12h0A288.92,288.92,0,0,1,300,588.84Zm0-560.75A271.91,271.91,0,0,0,107.73,492.27,271.93,271.93,0,1,0,454.23,76,270.39,270.39,0,0,0,300,28.09Z"
          transform="translate(-11.16 -11.16)"
        />
        <g>
          <path
            className={`TokenIcon--white`}
            d={characterDef}
            transform="translate(-11.16 -11.16)"
          />
        </g>
      </svg>
    );
  }
}

export default TokenIcon;
