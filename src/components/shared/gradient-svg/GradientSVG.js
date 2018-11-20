import React, { Component } from 'react';

import './GradientSVG.scss';

class GradientSVG extends Component {
  render() {
    let { startColor, endColor, idCSS, rotation } = this.props;

    let gradientTransform = `rotate(${rotation})`;

    return (
      <svg style={{ height: 0 }}>
        <defs>
          <radialGradient id={idCSS} gradientTransform={gradientTransform}>
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </radialGradient>
        </defs>
      </svg>
    );
  }
}

export default GradientSVG;
